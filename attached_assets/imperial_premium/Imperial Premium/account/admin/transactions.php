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
              <h4 class="nk-block-title fw-normal">All time transactions.</h4>
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
                                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text">Scope</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Status</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Action</span></th>
 
                                                    </tr>
                                                </thead>
                                                <tbody>
                                            <?php 

                                            $query = $conn->query("SELECT * FROM transactions ORDER BY id DESC");
                                             while($rows = mysqli_fetch_assoc($query)){
                                             $amount = $rows['amount'];
                                             $refNumber = $rows['refNumber'];
                                             $accountholder = $rows['accountholder'];
                                             $bankname = $rows['bankname'];
                                             $dated = $rows['dated'];
                                             $avalbal = $rows['accountbalance'];
                                             $description = $rows['description'];
                                             $type = $rows['type'];
                                             $id = $rows['id'];
                                             $scope = $rows['scope'];
                                             if ($type == "Debit") {
                                             $ico = "wallet-out";
                                             $color = "text-danger";
                                             $sign = "-";
                                             }
                                             else{
                                                $ico = "wallet-in";
                                                $color = "text-success";
                                                $sign = "+";
                                             }
                                             if($rows['status']== 1){
                                             	$stat = "<span class='text-success'>Completed</span>";
                                             }else{$stat = "<span class='text-danger'>Pending</span>";}
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
                                                            <span><?php echo$description ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-lg" data-order="Email Verified">
                                                            <ul class="list-status">
                                                                <?php echo$type ?>
                                                            </ul>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-lg">
                                                            <span><?php echo$scope ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                           <?php echo$stat; ?> 
                                                        </td>
                                                        <td class="nk-tb-col nk-tb-col-tools">
                                                            <ul class="nk-tb-actions gx-1">
                                                                <li class="nk-tb-action-hidden">
                                                                    <a href="edit_transfer?refNumber=<?php echo$refNumber; echo"&id=$id"; ?>" class="btn btn-trigger btn-icon" data-toggle="tooltip" data-placement="top" title="Edit">
                                                                        <em class="icon ni ni-edit"></em>
                                                                    </a>
                                                                </li>
                                                                 <li class="nk-tb-action-hidden">
                                                                    <form method="post" id="delete_form<?php echo$id ?>" action="../scripts/auth?action=delete_trx&id=<?php echo$id ?>&transaction=users">
                                                                    <button class="btn btn-trigger btn-icon" data-toggle="tooltip" data-placement="top" title="Delete">
                                                                        <em class="icon ni ni-delete text-danger"></em>
                                                                    </button>
                                                                    <div id="delete_result<?php echo$id ?>"></div>
                                                                </form>
                                                                </li>
                                                                <li>
                                                                    <div class="drodown">
                                                                        <a href="#" class="dropdown-toggle btn btn-icon btn-trigger" data-toggle="dropdown"><em class="icon ni ni-more-h"></em></a>
                                                                        <div class="dropdown-menu dropdown-menu-right">
                                                                            <ul class="link-list-opt no-bdr">
                                                                                <li><a href="edit_transfer?refNumber=<?php echo$refNumber; echo"&id=$id"; ?>"><em class="icon ni ni-eye"></em><span>View Details</span></a></li>
                                                                                
                                                                               
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                    
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript">
    $(document).ready(function (e) {
    $("#delete_form<?php echo$id ?>").on('submit',(function(e) {
        e.preventDefault();
        $.ajax({
            url: "../scripts/auth?action=delete_trx&id=<?php echo$id ?>&transaction=users",
            type: "POST",
            data:  new FormData(this),
            contentType: false,
            cache: false,
            processData:false,
            success: function(data)
            {
            $("#delete_result<?php echo$id ?>").html(data);
            },
            error: function() 
            {
            }           
       });
    }));
});
</script>
                                                <?php } ?>
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div><!-- .card-preview -->
              

                </div>



<?php 
include("footer.php");
?>