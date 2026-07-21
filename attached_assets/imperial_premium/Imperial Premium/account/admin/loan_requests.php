<?php include_once'header.php'; ?>

<div class="nk-content">
 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Loan Request Management.</h4>
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
                                                        
                                                        <th class="nk-tb-col"><span class="sub-text">Ref Number</span></th>
                                                        <th class="nk-tb-col"><span class="sub-text">Account Holder</span></th>
                                                        <th class="nk-tb-col tb-col-mb"><span class="sub-text">Amount</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Description</span></th>
                                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text">Type</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Status</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Action</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
												<?php 

												$query = $conn->query("SELECT * FROM loan_application ORDER BY id DESC");
												 while($rows = mysqli_fetch_assoc($query)){
												 $amount = $rows['loan_amount'];
												 $refNumber = $rows['ref'];
												 $dated = $rows['datecreated'];
												 $facility = $rows['facility'];
												 $id = $rows['id'];
												$description = $rows['reason'];
												 if($rows['status']== "pending"){
												 	$stat = "<span class='text-warning'>Pending</span>";
												 	$stt = "warning";	
												 }
												 elseif($rows['status'] == "success"){
												 $stt = "success";	
												 $stat = "<span class='text-success'>Approved</span>";	
												 }
												 else{$stat = "<span class='text-danger'>Rejected</span>"; $stt = "danger";}
												 $userid = $rows['userid'];
												 $sql = $conn->query("SELECT * FROM users WHERE id = '$userid'");
												 $ro = mysqli_fetch_array($sql);
												 $firstname = $ro['firstname']; $middlename = $ro['middlename']; $lastname = $ro['lastname'];

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
                                                                    <span><?php echo substr($refNumber, 0, 2); ?></span>
                                                                </div>
                                                                <div class="user-info">
                                                                    <span class="tb-lead"><?php echo$refNumber ?><span class="dot dot-<?php echo$stt ?> d-md-none ml-1"></span></span>
                                                                    <span><?php echo$dated ?></span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                          <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo"$firstname $middlename $lastname"; ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo$amount ?><span class="currency"> <?php echo$money ?></span></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                            <span><?php echo$description ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-lg" data-order="">
                                                           
                                                                <?php echo$facility ?>
                                                            
                                                        </td>
                                                     
                                                        <td class="nk-tb-col tb-col-md">
                                                           <?php echo$stat; ?> 
                                                        </td>
                                                        <td class="nk-tb-col nk-tb-col-tools">
                                                            <ul class="nk-tb-actions gx-1">
                                                                 <li class="nk-tb-action-hidden">
                                                                 	<?php if($rows['status'] == "pending"){ ?>
                                                                    <button class="btn btn-trigger btn-icon" <?php echo "data-toggle='modal' data-target='#approve".$rows['id']."'";
 ?> data-toggle="tooltip" data-placement="top" title="Approve Loan">
                                                                        <em class="icon ni ni-check-circle-fill text-success"></em>
                                                                    </button>
                                                                <?php } ?>
                                                                </li>
                                                                 <li class="nk-tb-action-hidden">
                                                                 <?php if($rows['status'] == "pending"){ ?>
                                                                    <button class="btn btn-trigger btn-icon"<?php echo "data-toggle='modal' data-target='#reject".$rows['id']."'";
 ?>  data-toggle="tooltip" data-placement="top" title="Reject Request" >
                                                                        <em class="icon ni ni-delete text-danger"></em>
                                                                    </button>
                                                                <?php } ?>   
                                                                </li>
                                                                 <li class="nk-tb-action-hidden">
                                                                 <?php if($rows['status'] == "rejected"){ ?>
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
 <!---- //APPROVE LOAN REQUEST MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="approve<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Approve Loan Request</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to approve <?php echo"$money ".number_format($amount)." Loan request made by $firstname $lastname $middlename"; ?>, The said amount will be credited into the user account after approving the loan! </strong>
              </div>
                <div class="approveResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                    <div class="form-group container">
                    	<textarea class="form-control" placeholder="Enter Loan approval Remarks*" id="msg<?php echo$rows['id'] ?>" name="msg<?php echo$rows['id'] ?>"></textarea>
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
          url: "../scripts/auth.php?action=approveLoanRequest&id=<?php echo$rows['id'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
          	document.getElementById("btnA<?php echo$rows['id'] ?>").disabled = false;
            $('.approveResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>

  <!--  //END OF APPROVE LOAN REQUEST MODAL--->
   <!---- //REJECT LOAN REQUEST MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="reject<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Reject Loan Request</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Reject <?php echo"$money ".number_format($amount)." Loan request made by $firstname $lastname $middlename"; ?>, The said amount will not be credited into the user account after approving the loan! </strong>
              </div>
                <div class="rejectResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                    <div class="form-group container">
                    	<textarea class="form-control" placeholder="Reason for rejection*" id="msg<?php echo$rows['id'] ?>" name="msg<?php echo$rows['id'] ?>"></textarea>
                    </div>
                 <div class="modal-footer">
                   <button type="submit" class="btn btn-primary btn-sm rejectBtn<?php echo$rows['id'] ?>" id="btnR<?php echo$rows['id'] ?>">Reject</button>
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
          url: "../scripts/auth.php?action=rejectLoanRequest&id=<?php echo$rows['id'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
          	document.getElementById("btnR<?php echo$rows['id'] ?>").disabled = false;
            $('.rejectResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
  </script>

  <!--  //END OF REJECT LOAN REQUEST MODAL--->

     <!---- //DELETE LOAN REQUEST MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="delete<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Delete Loan Request</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Delete <?php echo"$money ".number_format($amount)." Loan request made by $firstname $lastname $middlename"; ?></strong>
              </div>
                <div class="rejectResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                <input type="hidden" name="msg<?php echo$rows['id'] ?>" id="msg<?php echo$rows['id'] ?>">
                 <div class="modal-footer">
                   <button type="submit" class="btn btn-primary btn-sm deleteBtn<?php echo$rows['id'] ?>" id="btnD<?php echo$rows['id'] ?>">Delete</button>
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
      document.getElementById("btnD<?php echo$rows['id'] ?>").disabled = true;	
      var msg<?php echo$rows['id'] ?> = $('#msg<?php echo$rows['id'] ?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=deleteLoanRequest&id=<?php echo$rows['id'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
          	document.getElementById("btnD<?php echo$rows['id'] ?>").disabled = false;
            $('.rejectResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
  </script>


                                                <?php } ?>
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
  
<?php include_once'footer.php'; ?>