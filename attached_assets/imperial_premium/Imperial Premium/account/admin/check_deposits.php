<?php 
include("header.php");
?>

<div class="nk-content">

 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">All time Check Deposits.</h4>
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
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Check Number</span></th>
                                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text">Date</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Status</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Action</span></th>
 
                                                    </tr>
                                                </thead>
                                                <tbody>
                                            <?php 

                                            $query = $conn->query("SELECT * FROM check_deposit ORDER BY id DESC");
                                             while($rows = mysqli_fetch_assoc($query)){
                                             $amount = $rows['amount'];
                                             $refNumber = $rows['ref'];
                                             $dated = $rows['date_created'];
                                             $id = $rows['id'];
                                             $check_number = $rows['check_number'];
                                        
                                             if($rows['status']== "0"){
                                                $stat = "<span class='text-danger'>Pending</span>";
                                                  $btn = '<li class="nk-tb-action-hidden">
                                                 <a href="approve_check?refNumber='.$refNumber.'&id='.$id.'" class="btn btn-trigger btn-icon" data-toggle="tooltip" data-placement="top" title="Approve transaction">
                                                                        <em class="icon ni ni-check-circle-fill"></em>
                                                                    </a>
                                                                </li>';
                                             }else{$stat = "<span class='text-success'>Completed</span>";

                                            
                                                                 $btn = '<li class="nk-tb-action-hidden">
                                                                    <a href="edit_transfer?refNumber='.$refNumber.'&id='.$id.'" class="btn btn-trigger btn-icon" data-toggle="tooltip" data-placement="top" title="Edit">
                                                                        <em class="icon ni ni-edit"></em>
                                                                    </a>
                                                                </li>';


                                         }
                                             $userid = $rows['user_id'];
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
                                                                    <span class="tb-lead"><?php echo$refNumber ?><span class="dot dot-success d-md-none ml-1"></span></span>
                                                                    <span><?php echo$dated ?></span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                          <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo"$firstname $middlename $lastname"; ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo$amount ?><span class="currency"><?php echo$money ?></span></span>
                                                        </td>
                                                          <td class="nk-tb-col tb-col-md">
                                                            <span><?php echo$check_number ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                            <span><?php echo$dated ?></span>
                                                        </td>
                
                                                        <td class="nk-tb-col tb-col-md">
                                                           <?php echo$stat; ?> 
                                                        </td>
                                                        <td class="nk-tb-col nk-tb-col-tools">
                                                            <ul class="nk-tb-actions gx-1">
                                                               <?php echo$btn ?>
                                                                <li>
                                                                    <div class="drodown">
                                                                        <a href="#" class="dropdown-toggle btn btn-icon btn-trigger" data-toggle="dropdown"><em class="icon ni ni-more-h"></em></a>
                                                                        <div class="dropdown-menu dropdown-menu-right">
                                                                            <ul class="link-list-opt no-bdr">
                                                                                <li><a href="edit_transfer?refNumber=<?php echo$refNumber?>&id=<?php echo$id?>" ><em class="icon ni ni-eye"></em><span>View Details</span></a></li>
                                                                                
                                                                               
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                    </tr>

                                                <?php } ?>
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div><!-- .card-preview -->
              

                </div>



<?php 
include("footer.php");
?>