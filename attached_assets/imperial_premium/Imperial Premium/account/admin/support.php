<?php 
include("header.php");
?>
<div class="nk-content">
	 <div class="card card-bordered card-preview">
                     <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
                       <h5 class="text-white"> <em class="icon ni ni-question-alt"></em>Recent support tickets </h5>
                    </div>
                    <div class="card-body">
                      <table class="datatable-init table">
                  <thead>
                    <tr>
                     <th>Department</th>
                       <th>Ticket ID</th>
                      <th>Date</th>
                      <th>Comments</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                 <tbody>
                    <?php 
                    $query = $conn->query("SELECT * FROM support ORDER BY id ASC");
                     while ($rows = mysqli_fetch_array($query)) {
                     	 $iduser = $rows['userid'];
                     $userquery = $conn->query("SELECT * FROM users WHERE id = '$iduser'");
                     $userdetails = mysqli_fetch_array($userquery);
                     $firstname = $userdetails["firstname"];
                     $middlename = $userdetails["middlename"];
                     $lastname = $userdetails["lastname"];
                     $usercurrency = $userdetails["usercurrency"];
                     $fullname = "$firstname $middlename $lastname";
                        if($rows['status'] == "closed"){
                            $stat = "<strong class='text-danger'>Closed</strong>";
                            $btn = '<button class="btn btn-success btn-sm" data-toggle="modal" data-target="#reopen'.$rows['id'].'">open</button>';
                        }else{ $stat = "<strong class='text-success'>Active</strong>"; 
                              $btn = '<button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#close'.$rows['id'].'">close</button>';

                           }
                         $ticket = $rows['ticketid'];
                         $id = $rows['id'];
                                          ?>
                    <tr>
                      <td><?php echo$rows['department']; ?></td>    
                      <td><?php echo$rows['ticketid']; ?></td>  
                      <td><?php echo$rows['datecreated'] ?></td>
                      <td><?php $sql = $conn->query("SELECT * FROM reply WHERE ticketid = '$ticket'");
                       echo "(".mysqli_num_rows($sql).")";
                       ?></td>
                      <td><?php echo$stat; ?></td> 
                      <td><button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#replyModal<?php echo$rows['id'] ?>">View</button>
                      <?php echo$btn ?>
                      </td>
                      </tr> 

<!-- CHAT MODAL -->
<div class="modal fade" tabindex="-1" id="replyModal<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title"><?php echo$ticket?></h5>
            </div>
            <div class="modal-body bg-light">
                <p class="card-bordered rounded-sm p-1 bg-white"><?php echo$rows['message'] ?></p>
                <hr style="height:3px; background-color: #033d75; border-radius:3px;">
                <strong class="text-center" style="align-center text-align: center;">Discussion</strong>
                <div id="chatSection<?php echo$id?>">
                <?php 
                $queryy = $conn->query("SELECT * FROM reply WHERE ticketid = '$ticket'");
                while($r = mysqli_fetch_assoc($queryy)){
                    $reply = $r['message'];
                    $dated = $r['datecreated'];
                    if ($r['userid'] == 1) {
                        $alert = "alert-success";
                        $by = "Customer care";
                    }else{$alert = "alert-pro"; $by = "$fullname";}

                    if (mysqli_num_rows($queryy) < 1) {
                        echo "<center>No response so far</center>";
                    }
                ?>
                <div class="alert <?php echo$alert ?> w-100 p-1"> <?php  echo "$reply";?><br>
                    <small class="text-muted"><?php  echo "$dated";?></small><br>
                     <small class="text-muted"><?php  echo "$by";?></small>
                     </div>
                  <?php } ?>  
              </div>
            </div>             
            <form action="" method="post" id="sendForm<?php echo$rows['id'] ?>">
             <div class="nk-chat-editor" style="border-color:black;">
                   <div class="nk-chat-editor-upload  ml-n1">
                    <a href="#" class="btn btn-round btn-primary btn-icon"><em class="icon ni ni-plus-circle-fill"></em></a>
                     </div>
                     <div class="chatResult"></div>
                        <div class="nk-chat-editor-form">
                          <div class="form-control-wrap">
                            <input type="hidden" name="ticketid<?php echo$id ?>" id="ticketid<?php echo$id ?>" value="<?php echo$ticket?>">
                          <textarea name="reply<?php echo$id ?>" class="form-control form-control-simple no-resize" rows="1" id="reply<?php echo$id ?>" placeholder="Type your message..."></textarea>
                          </div>
                            </div>
                            <ul class="nk-chat-editor-tools g-2">
                             <li>
                                <div class="sendResult<?php echo$rows['id'] ?>"></div>
                              <button class="btn btn-round btn-primary btn-icon sendMsg<?php echo$rows['id'] ?>"><em class="icon ni ni-send-alt"></em></button>
                           </li>
                        </ul>
                     </div>
                 </form>
                 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
         <script type="text/javascript">
     $(document).ready(function () {
    $('.sendMsg<?php echo$rows['id'] ?>').click(function (e) {
      e.preventDefault();
      var reply<?php echo$id ?> = $('#reply<?php echo$id ?>').val();
      var ticketid<?php echo$id ?> = $('#ticketid<?php echo$id ?>').val();
      $.ajax
        ({
          type: "POST",
          url: "../scripts/send_reply_admin.php?id=<?php echo$id ?>",
          data: {"reply<?php echo$id ?>": reply<?php echo$id ?>, "ticketid<?php echo$id ?>": ticketid<?php echo$id ?>},
          success: function (data) {
            $('.sendResult<?php echo$rows['id'] ?>').html(data);
            $('#sendForm<?php echo$rows['id'] ?>')[0].reset();
          }
        });
    });
  });
                        </script>
                  <div class="modal-footer bg-light">
                <span class="sub-text btn btn-danger btn-sm text-white" data-dismiss="modal">Close</span>
            </div>
        </div>
    </div>
</div>

<!--- Close Modal------->
<div class="modal fade" tabindex="-1" id="close<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title"><?php echo$ticket?></h5>
            </div>
            <div class="modal-body">
               <strong>You are about to close this ticket, The user won't be able to add reply on it when it's closed.</strong>
              </div>
                <div class="closeResult<?php echo$rows['id'] ?>"></div>
                 <div class="modal-footer">
                 	<form action="" method="post">
                 		<input type="hidden" name="closeT<?php echo$id?>" value="<?php echo$id?>" id="closeT<?php echo$id?>">
                   <button type="submit" class="btn btn-primary btn-sm closeBtn<?php echo$rows['id'] ?>">Close ticket</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
         <script type="text/javascript">
     $(document).ready(function () {
    $('.closeBtn<?php echo$rows['id'] ?>').click(function (e) {
      e.preventDefault();
      var closeT<?php echo$id?> = $('#closeT<?php echo$id?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/close_ticket.php?id=<?php echo$id ?>",
          data: {"closeT<?php echo$id?>": closeT<?php echo$id?>, },
          success: function (data) {
            $('.closeResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>
    <!--- Reopen Modal------->
<div class="modal fade" tabindex="-1" id="reopen<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title"><?php echo$ticket?></h5>
            </div>
            <div class="modal-body">
               <strong>You are about to reopen this ticket, The user will be able to add reply on it when it's open.</strong>
              </div>
                <div class="reopenResult<?php echo$rows['id'] ?>"></div>
                 <div class="modal-footer">
                 	<form action="" method="post">
                 		<input type="hidden" name="reopenT<?php echo$id?>" value="<?php echo$id?>" id="reopenT<?php echo$id?>">
                   <button type="submit" class="btn btn-primary btn-sm reopenBtn<?php echo$rows['id'] ?>">Reopen ticket</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
         <script type="text/javascript">
     $(document).ready(function () {
    $('.reopenBtn<?php echo$rows['id'] ?>').click(function (e) {
      e.preventDefault();
      var reopenT<?php echo$id?> = $('#reopenT<?php echo$id?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/reopen_ticket.php?id=<?php echo$id ?>",
          data: {"reopenT<?php echo$id?>": reopenT<?php echo$id?>, },
          success: function (data) {
            $('.reopenResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>
           <?php   }   ?>
          </tbody>
      </table>
                  </div>  
              </div>
          </div>
<?php
include("footer.php");
?>	