<?php include_once'header.php'; ?>

<div class="nk-content">
 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Visual Card  Management.</h4>
                <div class="nk-block-des">
                  <p>
                   </p>
                      </div>
                       </div>
                            <div class="nk-block-head-content">
                                        <ul class="nk-block-tools gx-3">
                                            <li><a href="account_manager" class="btn btn-primary"><span>Home</span> <em class="icon ni ni-arrow-left"></em></a></li>
                                            <li><a href="fund_user" class="btn btn-success"><span>Fund an account</span> <em class="icon ni ni-invest"></em></a></li>
                                        </ul>
                                    </div><!-- .nk-block-head-content -->
                                </div><!-- .nk-block-between -->
                            </div><!-- .nk-block-head -->
                        </div>
                    </div>

                        <div class="card card-preview">
                                        <div class="card-inner">
                                            <table class="datatable-init nk-tb-list nk-tb-ulist" data-auto-responsive="false">
                                                <thead>
                                                    <tr class="nk-tb-item nk-tb-head">
                                                        <th class="nk-tb-col nk-tb-col-check">
                                                            <div class="custom-control custom-control-sm custom-checkbox notext">
                                                                <input type="checkbox" class="custom-control-input" id="uid">
                                                                <label class="custom-control-label" for="uid"></label>
                                                            </div>
                                                        </th>
                                                        
                                                        <th class="nk-tb-col"><span class="sub-text">Name On Card</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Type</span></th>
                                                        <th class="nk-tb-col"><span class="sub-text">Balance</span></th>
                                                        <th class="nk-tb-col tb-col-mb"><span class="sub-text">Card Details</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Status</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Action</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
												<?php 

												$query = $conn->query("SELECT * FROM visual_cards ORDER BY id DESC");
												 while($rows = mysqli_fetch_assoc($query)){
												 $balance = $rows['balance'];
												 $card_type = $rows['card_type'];
												 $dated = $rows['datecreated'];
												 $card_number = $rows['card_number'];
                                                 $fullname = $rows['fullname'];
                                                 $expiry_date = $rows['expiry_date'];
                                                 $ccv = $rows['ccv'];
												 $id = $rows['id'];

												 if($rows['status']== "pending"){
												 	$stat = "<span class='text-warning'>Pending</span>";
												 	$stt = "warning";	
												 }
												 elseif($rows['status'] == "active"){
												 $stt = "success";	
												 $stat = "<span class='text-success'>Active</span>";	
												 }
                                                 elseif($rows['status'] == "inactive"){
                                                 $stt = "success";  
                                                 $stat = "<span class='text-danger'>Inactive</span>";    
                                                 }
												 else{$stat = "<span class='text-danger'>Rejected</span>"; $stt = "danger";}

												 $userid = $rows['userid'];
												 $sql = $conn->query("SELECT * FROM users WHERE id = '$userid'");
												 $ro = mysqli_fetch_array($sql);
												 $firstname = $ro['firstname']; $middlename = $ro['middlename']; $lastname = $ro['lastname'];
                                                 if($rows['card_type'] == "mastercard"){
                                                $icon = '<em class="icon ni ni-master-card h3 text-white"></em>';
                                    
                                                }
                                                if($rows['card_type'] == "visa"){
                                                    $icon = '<em class="icon ni ni-visa-alt h3 text-white"></em>';
                                            
                                                }
                                                if($rows['card_type'] == "discover"){
                                                    $icon = '<em class="icon ni ni-discover h3  text-white"></em>';
                                                  
                                                }

												?>
                                                 <tr class="nk-tb-item">
                                                        <td class="nk-tb-col nk-tb-col-check">
                                                            <div class="custom-control custom-control-sm custom-checkbox notext">
                                                                <input type="checkbox" class="custom-control-input" id="<?php echo$id ?>">
                                                                <label class="custom-control-label" for="<?php echo$id ?>"></label>
                                                            </div>
                                                        </td>
                                                        <td class="nk-tb-col">
                                                            <div class="user-card">
                                                                <div class="user-avatar bg-dim-primary d-none d-sm-flex">
                                                                    <?php echo$icon ?>
                                                                </div>
                                                                <div class="user-info">
                                                                    <span class="tb-lead"><?php echo$fullname ?><span class="dot dot-<?php echo$stt ?> d-md-none ml-1"></span></span>
                                                                    <span><?php echo$dated ?></span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                          <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo"$card_type"; ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo$balance ?><span class="currency"> <?php echo$money ?></span></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                            <span class="number-sm">Num: <?php echo$card_number ?></span><br>
                                                            <span class="number-sm">CCV: <?php echo$ccv ?></span><br>
                                                            <span class="number-sm">EXP: <?php echo$expiry_date ?></span><br>
                                                        </td>
                                                        
                                                        <td class="nk-tb-col tb-col-md">
                                                           <?php echo$stat; ?> 
                                                        </td>
                                                        <td class="nk-tb-col nk-tb-col-tools">
                                                            <ul class="nk-tb-actions gx-1">
                                                                 <li class="nk-tb-action-hidden">
                                                                 	<?php if($rows['status'] == "pending"){ ?>
                                                                    <button class="btn btn-trigger btn-icon" <?php echo "data-toggle='modal' data-target='#approve".$rows['id']."'"; ?> data-toggle="tooltip" data-placement="top" title="Approve Card">
                                                                        <em class="icon ni ni-check-circle-fill text-success"></em>
                                                                    </button>
                                                                <?php } ?>
                                                                </li>
                                                                 <li class="nk-tb-action-hidden">
                                                                 <?php if($rows['status'] == "pending"){ ?>
                                                                    <button class="btn btn-trigger btn-icon"<?php echo "data-toggle='modal' data-target='#reject".$rows['id']."'"; ?>  data-toggle="tooltip" data-placement="top" title="Reject Card" >
                                                                        <em class="icon ni ni-delete-fill text-danger"></em>
                                                                    </button>
                                                                <?php } ?>   
                                                                </li>
                                                                 <li class="nk-tb-action-hidden">
                                                                 <?php if($rows['status'] == "active"){ ?>
                                                                    <button class="btn btn-trigger btn-icon" <?php echo "data-toggle='modal' data-target='#deactivate".$rows['id']."'"; ?>  data-toggle="tooltip" data-placement="top" title="Deactivate">
                                                                        <em class="icon ni ni-check-circle-fill text-danger"></em>
                                                                    </button>
                                                                <?php } ?>   
                                                                </li>
                                                                 <li class="nk-tb-action-hidden">
                                                                 <?php if($rows['status'] == "inactive"){ ?>
                                                                    <button class="btn btn-trigger btn-icon" <?php echo "data-toggle='modal' data-target='#activate".$rows['id']."'"; ?>  data-toggle="tooltip" data-placement="top" title="activate">
                                                                        <em class="icon ni ni-check-circle-fill text-success"></em>
                                                                    </button>
                                                                <?php } ?>   
                                                                </li>
                                                                 <li class="nk-tb-action-hidden">
                                                                 <?php if($rows['status'] == "inactive"){ ?>
                                                                    <button class="btn btn-trigger btn-icon" <?php echo "data-toggle='modal' data-target='#delete".$rows['id']."'"; ?>  data-toggle="tooltip" data-placement="top" title="Delete">
                                                                        <em class="icon ni ni-delete-fill text-danger"></em>
                                                                    </button>
                                                                <?php } ?>   
                                                                </li>
                                                                <li>
                                                                    <div class="drodown">
                                                                        <a href="#" class="dropdown-toggle btn btn-icon btn-trigger" data-toggle="dropdown"><em class="icon ni ni-more-h"></em></a>
                                                                        <div class="dropdown-menu dropdown-menu-right">
                                                                            <ul class="link-list-opt no-bdr">
                                                                                <li><a href="user_profile?id=<?php echo$userid; ?>"><em class="icon ni ni-eye"></em><span>View User</span></a></li>
                                                                                
                                                                               
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                    </tr>
 <!---- //APPROVE CARD REQUEST MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="approve<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Approve Visual Card Request</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to approve  VisualCard Request made by <?php echo"$firstname $lastname $middlename"; ?></strong>
              </div>
                <div class="approveResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                    <div class="form-group container">
                    	<input type="hidden" id="msg<?php echo$rows['id'] ?>" name="msg<?php echo$rows['id'] ?>">
                    </div>
                 <div class="modal-footer">
                    
                   <button type="submit" class="btn btn-primary btn-sm approveBtn<?php echo$rows['id'] ?>" id='btnA<?php echo$rows['id'] ?>'>Approve</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
     <script src="../js/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.approveBtn<?php echo$rows['id'] ?>').click(function (e) {
      e.preventDefault();
      document.getElementById("btnA<?php echo$rows['id'] ?>").disabled = true;	
      var msg<?php echo$rows['id'] ?> = $('#msg<?php echo$rows['id'] ?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=approveCardRequest&id=<?php echo$rows['id'] ?>&userid=<?php echo$rows['userid'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
          	document.getElementById("btnA<?php echo$rows['id'] ?>").disabled = false;
            $('.approveResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>

  <!--  //END OF APPROVE CARD REQUEST MODAL--->
  <!---- //REJECT CARD REQUEST MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="reject<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Reject Visual Card Request</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Reject  VisualCard Request made by <?php echo"$firstname $lastname $middlename"; ?></strong>
              </div>
                <div class="rejectResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                    <div class="form-group container">
                        <input type="hidden" id="msg<?php echo$rows['id'] ?>" name="msg<?php echo$rows['id'] ?>">
                    </div>
                 <div class="modal-footer">
                    
                   <button type="submit" class="btn btn-primary btn-sm rejectBtn<?php echo$rows['id'] ?>" id='btnR<?php echo$rows['id'] ?>'>Reject</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
     <script src="../js/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.rejectBtn<?php echo$rows['id'] ?>').click(function (e) {
      e.preventDefault();
      document.getElementById("btnR<?php echo$rows['id'] ?>").disabled = true;  
      var msg<?php echo$rows['id'] ?> = $('#msg<?php echo$rows['id'] ?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=rejectCardRequest&id=<?php echo$rows['id'] ?>&userid=<?php echo$rows['userid'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
            document.getElementById("btnR<?php echo$rows['id'] ?>").disabled = false;
            $('.rejectResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>

  <!--  //END OF REJECT CARD REQUEST MODAL--->
 <!---- //DEACTIVATE CARD MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="deactivate<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Deactivate Visual Card</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Deactivate  VisualCard owned by <?php echo"$firstname $lastname $middlename"; ?></strong>
              </div>
                <div class="deactivateResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                    <div class="form-group container">
                        <input type="hidden" id="msg<?php echo$rows['id'] ?>" name="msg<?php echo$rows['id'] ?>">
                    </div>
                 <div class="modal-footer">
                    
                   <button type="submit" class="btn btn-primary btn-sm deactivateBtn<?php echo$rows['id'] ?>" id='btnD<?php echo$rows['id'] ?>'>Deactivate</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
     <script src="../js/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.deactivateBtn<?php echo$rows['id'] ?>').click(function (e) {
      e.preventDefault();
      document.getElementById("btnD<?php echo$rows['id'] ?>").disabled = true;  
      var msg<?php echo$rows['id'] ?> = $('#msg<?php echo$rows['id'] ?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=blockVisualCard&id=<?php echo$rows['id'] ?>&userid=<?php echo$rows['userid'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
            document.getElementById("btnD<?php echo$rows['id'] ?>").disabled = false;
            $('.deactivateResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>

  <!--  //END OF DEACTIVATE CARD MODAL--->
  <!---- //ACTIVATE CARD MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="activate<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">activate Visual Card</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to activate  VisualCard owned by <?php echo"$firstname $lastname $middlename"; ?></strong>
              </div>
                <div class="activateResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                    <div class="form-group container">
                        <input type="hidden" id="msg<?php echo$rows['id'] ?>" name="msg<?php echo$rows['id'] ?>">
                    </div>
                 <div class="modal-footer">
                    
                   <button type="submit" class="btn btn-primary btn-sm activateBtn<?php echo$rows['id'] ?>" id='btnA<?php echo$rows['id'] ?>'>activate</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
     <script src="../js/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.activateBtn<?php echo$rows['id'] ?>').click(function (e) {
      e.preventDefault();
      document.getElementById("btnA<?php echo$rows['id'] ?>").disabled = true;  
      var msg<?php echo$rows['id'] ?> = $('#msg<?php echo$rows['id'] ?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=activateVisualCard&id=<?php echo$rows['id'] ?>&userid=<?php echo$rows['userid'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
            document.getElementById("btnA<?php echo$rows['id'] ?>").disabled = false;
            $('.activateResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>

  <!--  //END OF DEACTIVATE CARD MODAL--->
 <!---- //ACTIVATE CARD MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="delete<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Delete Visual Card</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Delete  VisualCard owned by <?php echo"$firstname $lastname $middlename"; ?></strong>
              </div>
                <div class="deleteResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                    <div class="form-group container">
                        <input type="hidden" id="msg<?php echo$rows['id'] ?>" name="msg<?php echo$rows['id'] ?>">
                    </div>
                 <div class="modal-footer">
                    
                   <button type="submit" class="btn btn-primary btn-sm deleteBtn<?php echo$rows['id'] ?>" id='btnDE<?php echo$rows['id'] ?>'>Delete</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
     <script src="../js/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.deleteBtn<?php echo$rows['id'] ?>').click(function (e) {
      e.preventDefault();
      document.getElementById("btnDE<?php echo$rows['id'] ?>").disabled = true;  
      var msg<?php echo$rows['id'] ?> = $('#msg<?php echo$rows['id'] ?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=deleteVisualCard&id=<?php echo$rows['id'] ?>&userid=<?php echo$rows['userid'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
            document.getElementById("btnDE<?php echo$rows['id'] ?>").disabled = false;
            $('.deleteResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>

  <!--  //END OF DELETE  MODAL--->

    


                                                <?php } ?>
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
  
<?php include_once'footer.php'; ?>