<?php include_once'header.php'; ?>

<?php if(isset($_GET['id']) AND $_GET['action'] == "viewAp"){ 
    $id = $_GET['id'];
    $query = $conn->query("SELECT * FROM kyc WHERE id = '$id'");
    $result = mysqli_fetch_array($query);
     $userid = $result['userid'];
     $sql = $conn->query("SELECT * FROM users WHERE id = '$userid'");
     $ro = mysqli_fetch_array($sql);
     $firstname = $ro['firstname']; $middlename = $ro['middlename']; $lastname = $ro['lastname'];
     $fullname = "$firstname $middlename $lastname";
    ?>
  <!-- content @s -->
                <div class="nk-content nk-content-fluid">
                    <div class="container-xl wide-lg">
                        <div class="nk-content-body">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-between g-3">
                                    <div class="nk-block-head-content">
                                        <h3 class="nk-block-title page-title">KYC / <strong class="text-primary small"><?php echo$fullname ?></strong></h3>
                                        <div class="nk-block-des text-soft">
                                            <ul class="list-inline">
                                                <li>Refrence Number: <span class="text-base"><?php echo$result['ref'] ?></span></li>
                                                <li>Submited At: <span class="text-base"><?php echo$result['datecreated'] ?></span></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="nk-block-head-content">
                                        <a onclick="window.history.go(-1)" class="btn btn-outline-light bg-white d-none d-sm-inline-flex"><em class="icon ni ni-arrow-left"></em><span>Back</span></a>
                                        <a onclick="window.history.go(-1)" class="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"><em class="icon ni ni-arrow-left"></em></a>
                                    </div>
                                </div>
                            </div><!-- .nk-block-head -->
                            <div class="nk-block">
                                <div class="row gy-5">
                                    <div class="col-lg-5">
                                        <div class="nk-block-head">
                                            <div class="nk-block-head-content">
                                                <h5 class="nk-block-title title">Application Info</h5>
                                                <p>Submission date, approve date, status etc.</p>
                                            </div>
                                        </div><!-- .nk-block-head -->
                                        <div class="card card-bordered">
                                            <ul class="data-list is-compact">
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Submitted By</div>
                                                        <div class="data-value"><?php echo$fullname ?></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Submitted At</div>
                                                        <div class="data-value"><?php echo$result['datecreated'] ?></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Status</div>
                                                        <?php if($result['status'] == "success"){ ?>
                                                        <div class="data-value"><span class="badge badge-dim badge-sm badge-outline-success">Approved</span></div>
                                                    <?php } else{ ?>
                                                        <div class="data-value"><span class="badge badge-dim badge-sm badge-outline-warning">Pending</span></div>
                                                    <?php } ?>
                                                    </div>
                                                </li>
                                
                                            </ul>
                                        </div><!-- .card -->
                                        <div class="nk-block-head">
                                            <div class="nk-block-head-content">
                                                <h5 class="nk-block-title title">Uploaded Documents</h5>
                                                <p>Here is user uploaded documents.</p>
                                            </div>
                                        </div>
                                        <div class="card card-bordered">
                                            <ul class="data-list is-compact">
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Document Type</div>
                                                        <div class="data-value"><?php echo$result['id_type'] ?></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Front Side</div>
                                                        <div class="data-value"><?php echo$result['id_type'] ?></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Back Side</div>
                                                        <div class="data-value"><?php echo$result['id_type'] ?></div>
                                                    </div>
                                                </li>
                                             
                                            </ul>
                                        </div><!-- .card -->
                                    </div><!-- .col -->
                                    <div class="col-lg-7">
                                        <div class="nk-block-head">
                                            <div class="nk-block-head-content">
                                                <h5 class="nk-block-title title">Applicant Information</h5>
                                                <p>Basic info, like name, phone, address, country etc.</p>
                                            </div>
                                        </div>
                                        <div class="card card-bordered">
                                            <ul class="data-list is-compact">
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">First Name</div>
                                                        <div class="data-value"><?php echo$result['firstname'] ?></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Last Name</div>
                                                        <div class="data-value"><?php echo$result['lastname'] ?></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Email Address</div>
                                                        <div class="data-value"><?php echo$result['email'] ?></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Phone Number</div>
                                                        <div class="data-value text-soft"><em><?php echo$result['phone'] ?></em></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Date of Birth</div>
                                                        <div class="data-value"><?php echo$result['dob'] ?></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Full Address</div>
                                                        <div class="data-value"><?php echo$result['address1'] ?></div>
                                                    </div>
                                                </li>
                                                <li class="data-item">
                                                    <div class="data-col">
                                                        <div class="data-label">Country of Residence</div>
                                                        <div class="data-value"><?php echo$result['nationality'] ?></div>
                                                    </div>
                                                </li>
                                            
                                            </ul>
                                        </div>
                                    </div><!-- .col -->
                                </div><!-- .row -->
                            </div><!-- .nk-block -->
                        </div>
                    </div>
                </div>
                <!-- content @e -->

<?php } else{ ?>
<div class="nk-content">
 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">KYC Management.</h4>
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
                                                        <th class="nk-tb-col tb-col-mb"><span class="sub-text">Doc Type</span></th>
                                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text">Image</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Status</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Action</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
												<?php 

												$query = $conn->query("SELECT * FROM kyc ORDER BY id DESC");
												 while($rows = mysqli_fetch_assoc($query)){
												 $refNumber = $rows['ref'];
												 $dated = $rows['datecreated'];
												 $id = $rows['id'];
												 $front = $rows['front'];
                                                 $doc_type = $rows['id_type'];
                                                 $back = $rows['back'];
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
                                                                    <span><?php echo substr($firstname, 0, 2); ?></span>
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
                                                            <span class="tb-amount"><?php echo$doc_type ?><span class="currency"></span></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                            <span class="btn btn-sm btn-default border-dark" <?php echo "data-toggle='modal' data-target='#front".$rows['id']."'";?>><em class="icon ni ni-eye text-primary"></em>front Page</span>
                                                             <span class="btn btn-sm btn-default border-dark" <?php echo "data-toggle='modal' data-target='#back".$rows['id']."'";?>><em class="icon ni ni-eye text-primary"></em>Back Page</span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                           <?php echo$stat; ?> 
                                                        </td>
                                                        <td class="nk-tb-col nk-tb-col-tools">
                                                            <ul class="nk-tb-actions gx-1">
                                                                 <li class="nk-tb-action-hidden">
                                                                 	<?php if($rows['status'] == "pending"){ ?>
                                                                    <button class="btn btn-trigger btn-icon" <?php echo "data-toggle='modal' data-target='#approve".$rows['id']."'";?> data-toggle="tooltip" data-placement="top" title="Approve Loan">
                                                                        <em class="icon ni ni-check-circle-fill text-success"></em>
                                                                    </button>
                                                                <?php } ?>
                                                                </li>
                                                                 <li class="nk-tb-action-hidden">
                                                                 <?php if($rows['status'] == "pending"){ ?>
                                                                    <button class="btn btn-trigger btn-icon"<?php echo "data-toggle='modal' data-target='#reject".$rows['id']."'";?>  data-toggle="tooltip" data-placement="top" title="Reject Request" >
                                                                        <em class="icon ni ni-delete text-danger"></em>
                                                                    </button>
                                                                <?php } ?>   
                                                                </li>
                                                                 <li class="nk-tb-action-hidden">
                                                                    <a href="kyc?action=viewAp&id=<?php echo$rows['id'] ?>" class="btn btn-trigger btn-icon" data-toggle="tooltip" data-placement="top" title="View Details" >
                                                                        <em class="icon ni ni-eye"></em>
                                                                    </a>
                                                                </li>
                                                                </ul>
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
 <!---- //APPROVE KYC REQUEST MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="approve<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Approve KYC</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to approve the KYC application for <?php echo"$firstname $middlename $lastname"; ?>.</strong>
              </div>
                <div class="approveResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                    <div class="form-group container">
                    	<textarea class="form-control" placeholder="Enter KYC approval Remarks for the applicant*" id="msg<?php echo$rows['id'] ?>" name="msg<?php echo$rows['id'] ?>"></textarea>
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
          url: "../scripts/auth.php?action=approveKyc&id=<?php echo$rows['id'] ?>&userid=<?php echo$rows['userid'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
          	document.getElementById("btnA<?php echo$rows['id'] ?>").disabled = false;
            $('.approveResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>

  <!--  //END OF APPROVE KYC REQUEST MODAL--->
 <!---- //REJECT KYC REQUEST MODAL---->                                                  
 <div class="modal fade" tabindex="-1" id="reject<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Reject KYC</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to reject the  KYC application for <?php echo"$firstname $middlename $lastname"; ?>. The application will be deleted to enable the user make another Submission</strong>
              </div>
                <div class="rejectResult<?php echo$rows['id'] ?>"></div>
                <form action="" method="post">
                    <div class="form-group container">
                        <textarea class="form-control" placeholder="Explain to applicant why you're rejecting this KYC*" id="msg<?php echo$rows['id'] ?>" name="msg<?php echo$rows['id'] ?>"></textarea>
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
          url: "../scripts/auth.php?action=rejectKyc&id=<?php echo$rows['id'] ?>&userid=<?php echo$rows['userid'] ?>",
          data: {"msg<?php echo$rows['id'] ?>": msg<?php echo$rows['id'] ?>, },
          success: function (data) {
            document.getElementById("btnR<?php echo$rows['id'] ?>").disabled = false;
            $('.rejectResult<?php echo$rows['id'] ?>').html(data);
          }
        });
    });
  });
    </script>

  <!--  //END OF REJECT KYC REQUEST MODAL--->

<!----KYC FRONT IMAGE---->
   <div class="modal fade" tabindex="-1" id="front<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Front Picture</h5>
            </div>
            <div class="modal-body">
               <img src="../images/<?php echo$front ?>" width="100%" load="lazy">
              </div>
                <div class="modal-footer">
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                        </div>     
                     </div>
                 </div>
             </div>

             <!----KYC BACK IMAGE---->
   <div class="modal fade" tabindex="-1" id="back<?php echo$rows['id'] ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Back Picture</h5>
            </div>
            <div class="modal-body">
               <img src="../images/<?php echo$back ?>" width="100%" load="lazy">
              </div>
                <div class="modal-footer">
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                        </div>     
                     </div>
                 </div>
             </div>
 
 
  <!--  //END OF REJECT LOAN REQUEST MODAL--->


                                                <?php } ?>
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
  <?php } ?>
<?php include_once'footer.php'; ?>