<?php
require_once('header.php');
?>
 <!-- content @s -->
                <div class="nk-content nk-content-fluid">
                    <div class="container-xl wide-lg">
                        <div class="nk-content-body">
                            <div class="nk-block-head">
                                <div class="nk-block-head-sub"><span>Account Wallet</span> </div>
                                <div class="nk-block-between-md g-4">
                                    <div class="nk-block-head-content">
                                        <h2 class="nk-block-title fw-normal">Wallet / Assets</h2>
                                        <div class="nk-block-des">
                                            <p>Crypto Currency Assets Management</p>
                                        </div>
                                    </div>
                                    <div class="nk-block-head-content">
                                        <ul class="nk-block-tools gx-3">
                                            <li><a href="users" class="btn btn-primary"><span>Back</span> <em class="icon ni ni-arrow-long-left"></em></a></li>
                                        </ul>
                                    </div>
                                </div><!-- .nk-block-between -->
                            </div><!-- .nk-block-head -->
                          <?php if(!isset($_GET['action'])){ ?>  
                            <div class="nk-block">
                                <div class="nk-block-head-sm">
                                    <div class="nk-block-head-content">
                                        <h5 class="nk-block-title title">Crypto Accounts</h5>
                                    </div>
                                </div>
                                <div class="row g-gs">
                                   <?php $query = $conn->query("SELECT * FROM cryptos ORDER BY id DESC");
                                    while($r = mysqli_fetch_array($query)){
                                    	$coinid = $r['id'];
                                    	$coin = $r['code'];
                                    	$query2  = $conn->query("SELECT SUM(amount) AS count  FROM crypto_deposits WHERE coin = '$coin'");
                                    	if(mysqli_num_rows($query2) < 1){
                                    		$bal = 0.00000;
                                    		$usd = 0.00000;
                                    	}
                                    	else{
            
                                    	$sum = mysqli_fetch_assoc($query2);
                                        $bal = round($sum['count'], 5);
                                        $usd = cryptoConverterB($bal, $coin);
                                        }
                                        
                                    	if($r['status'] == "1"){
                                    		$status = "danger";
                                    		$txt = "Disable";
                                    		$eye = '<em class="icon ni ni-eye-off-fill"></em>';
                                    		$modal = "data-toggle='modal' data-target='#Disable".$coinid."'";
                                    	    }else{
                                    	    $status = "success";
                                    		$txt = "Enable";
                                    		$modal = "data-toggle='modal' data-target='#Enable".$coinid."'";
                                    		$eye = '<em class="icon ni ni-eye-alt-fill"></em>';
                                    	}
        
                                    ?>
                                    <div class="col-sm-6 col-lg-4 col-xl-6 col-xxl-4">
                                        <div class="card card-bordered">
                                            <div class="nk-wgw">
                                                <div class="nk-wgw-inner">
                                                    <a class="nk-wgw-name" href="#">
                                                        <div class="nk-wgw-icon">
                                                            <?php echo$r['symbol']; ?>
                                                        </div>
                                                        <h5 class="nk-wgw-title title"><?php echo$r['crypto_name'] ?> Wallet</h5>
                                                    </a>
                                                    <div class="nk-wgw-balance">
                                                        <div class="amount"><?php echo$bal ?><span class="currency currency-eth"><?php echo$r['code'] ?></span></div>
                                                        <div class="amount-sm"><?php echo round($usd, 2) ?><span class="currency currency-usd">USD</span></div>
                                                    </div>
                                                </div>
                                                <div class="nk-wgw-actions">
                                                    <ul>
                                                        <li><button <?php echo$modal ?> class="btn btn-sm btn-<?php echo$status?>"><?php echo$eye ?> <?php echo$txt ?></button></li>
                                             
                                                        <li><button <?php echo "data-toggle='modal' data-target='#Update".$coinid."'";
 ?> class="btn btn-sm btn-primary"><em class="icon ni ni-update"></em><span>Update Wallet</span></button></li>
                                                    </ul>
                                                </div>
                                                <div class="nk-wgw-more dropdown">
                                                    <button type="submit" class="btn btn-icon btn-light"><?php echo $r['symbol'] ?></button>
                                                </div>
                                            </div>
                                        </div><!-- .card -->
                                    </div>

<!--- Disable Wallet Modal------->
<div class="modal fade" tabindex="-1" id="Disable<?php echo$coinid ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Disable Wallet</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Disable <?php echo$r['crypto_name'] ?>, Users won't be able to deposit Crypto Using this Wallet henceforth! </strong>
              </div>
                <div class="DisableResult<?php echo$coinid ?>"></div>
                 <div class="modal-footer">
                    <form action="" method="post">
                      <input type="hidden" name="<?php echo$coin?>" value="<?php echo$coin?>" id="<?php echo$coin?>">
                   <button type="submit" class="btn btn-primary btn-sm closeBtn<?php echo$coinid ?>">Disable</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.closeBtn<?php echo$coinid ?>').click(function (e) {
      e.preventDefault();
      var <?php echo$coin?> = $('#<?php echo$coin?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=DisableCrypto&id=<?php echo$coinid ?>",
          data: {"<?php echo$coin?>": <?php echo$coin ?>, },
          success: function (data) {
            $('.DisableResult<?php echo$coinid ?>').html(data);
          }
        });
    });
  });
    </script>
 <!--- Enable Transfer Transfer Modal------->

 <div class="modal fade" tabindex="-1" id="Enable<?php echo$coinid ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Enable Wallet</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Enable <?php echo$r['crypto_name'] ?>, Users will be able to deposit Crypto Using this Wallet henceforth! </strong>
              </div>
                <div class="EnableResult<?php echo$coinid ?>"></div>
                 <div class="modal-footer">
                    <form action="" method="post">
                        <input type="hidden" name="<?php echo$coin?>" value="<?php echo$coin?>" id="<?php echo$coin?>">
                   <button type="submit" class="btn btn-primary btn-sm closeBtnB<?php echo$coinid ?>">Enable</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.closeBtnB<?php echo$coinid ?>').click(function (e) {
      e.preventDefault();
      var <?php echo$coin?> = $('#<?php echo$coin?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=EnableCrypto&id=<?php echo$coinid ?>",
          data: {"<?php echo$coin?>": <?php echo$coin ?>, },
          success: function (data) {
            $('.EnableResult<?php echo$coinid ?>').html(data);
          }
        });
    });
  });
    </script>
    <!--- Update Wallet Details------->

 <div class="modal fade" tabindex="-1" id="Update<?php echo$coinid ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Update Wallet</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Update <?php echo$r['crypto_name'] ?> Wallet Address for accepting Deposits. </strong>
              </div>
              <form action="" method="post">
              	 <div class="form-control-group p-2">
                    <input type="text" class="form-control form-control-lg"  name="wallet<?php echo$coinid ?>" id="wallet<?php echo$coinid ?>" value = "<?php echo$r['address'] ?>">
                     <div class="form-dropdown">
                     <div class="text"><?php echo$coin ?><span></span></div>
                     </div>
                   </div>
                <div class="updateResult<?php echo$coinid ?>"></div>
                 <div class="modal-footer">
                        <input type="hidden" name="<?php echo$coin?>" value="<?php echo$coin?>" id="<?php echo$coin?>">
                        
                   <button type="submit" class="btn btn-primary btn-sm UpdateBtn<?php echo$coinid ?>">Update</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.UpdateBtn<?php echo$coinid ?>').click(function (e) {
      e.preventDefault();
      var wallet<?php echo$coinid?> = $('#wallet<?php echo$coinid?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=UpdateCrypto&id=<?php echo$coinid ?>",
          data: {"wallet<?php echo$coinid?>": wallet<?php echo$coinid ?>, },
          success: function (data) {
            $('.updateResult<?php echo$coinid ?>').html(data);
          }
        });
    });
  });
    </script>
   <?php } ?>
   </div><!-- .row -->
   <?php } elseif ($_GET['action'] == "pending_deposits") { ?>
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
                                                        
                                                        <th class="nk-tb-col"><span class="sub-text">Currency</span></th>
                                                        <th class="nk-tb-col"><span class="sub-text">User</span></th>
                                                        <th class="nk-tb-col tb-col-mb"><span class="sub-text">Amount</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Date</span></th>
                                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text">Status</span></th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                           

                                              <?php 
                                              $query = $conn->query("SELECT * FROM crypto_deposits WHERE status = 'pending' ORDER BY id DESC");
                                                while ($rows = mysqli_fetch_array($query)) {
                                             	$userid3 = $rows['userid'];
                                             	$id = $rows['id'];
                                                $coin = $rows['coin'];
                                             	$query2 = $conn->query("SELECT * FROM cryptos WHERE code = '$coin'");
                                                $coindata = mysqli_fetch_array($query2);

                                                $query3 = $conn->query("SELECT * FROM users WHERE id = '$userid3'");
                                                $user = mysqli_fetch_array($query3);
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
                                                                    <span><?php echo $coindata['symbol']; ?></span>
                                                                </div>
                                                                <div class="user-info">
                                                                    <span class="tb-lead"><?php echo$coindata['crypto_name'] ?><span class="dot dot-success d-md-none ml-1"></span></span>
                                                                    <span><?php  ?></span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                          <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo"".$user['firstname']." ".$user['lastname']." ".$user['middlename'].""; ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo$coin ?> <span class="currency"><?php echo$rows['amount'] ?></span></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                            <span><?php echo$rows['datecreated'] ?></span>
                                                        </td>
                                                       <td class="nk-tb-col nk-tb-col-tools">
                                                            <ul class="nk-tb-actions gx-1">
                                                                <li class="nk-tb-action-hidden">
                                                                    <a href="#" class="btn btn-trigger btn-icon" <?php echo "data-toggle='modal' data-target='#approve".$id."'"; ?> data-placement="top" title="Approve">
                                                                        <em class="icon ni ni-wallet-fill text-success"></em>
                                                                    </a>
                                                                </li>
                                                                <li class="nk-tb-action-hidden">
                                                                    <a href="#" class="btn btn-trigger btn-icon" data-placement="top" title="Reject"  <?php echo "data-toggle='modal' data-target='#reject".$id."'"; ?>>
                                                                        <em class="icon ni ni-external text-danger"></em>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        
                                                    </tr>
 <!--- Accept Crypto Deposit------->
 <div class="modal fade" tabindex="-1" id="approve<?php echo$id ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Approve Deposit</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Approve <?php echo $rows['coin']; echo " "; echo$rows['amount'] ?> Deposit Made by <?php echo"".$user['firstname']." ".$user['lastname']." ".$user['middlename'].""; ?> </strong>
              </div>
              <form action="" method="post">
                <div class="approve_result<?php echo$id ?>"></div>
                 <div class="modal-footer">
                        <input type="hidden" name="f<?php echo$id?>" value="<?php echo$id?>" id="f<?php echo$id?>">
                   <button type="submit" class="btn btn-primary btn-sm approveBtn<?php echo$id ?>">Approve</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.approveBtn<?php echo$id ?>').click(function (e) {
      e.preventDefault();
      var f<?php echo$id?> = $('#f<?php echo$id?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=approveCrypto&id=<?php echo$id ?>&amount=<?php echo$rows['amount'] ?>&userid=<?php echo$userid3 ?>&coin=<?php echo$coin ?>",
          data: {"f<?php echo$id?>": f<?php echo$id ?>, },
          success: function (data) {
            $('.approve_result<?php echo$id ?>').html(data);
          }
        });
    });
  });
    </script>

     <!--- Reject Crypto Deposit------->
 <div class="modal fade" tabindex="-1" id="reject<?php echo$id ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Reject Deposit</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Reject <?php echo $rows['coin']; echo " "; echo$rows['amount'] ?> Deposit Made by <?php echo"".$user['firstname']." ".$user['lastname']." ".$user['middlename'].""; ?> </strong>
              </div>
              <form action="" method="post">
                <div class="reject_result<?php echo$id ?>"></div>
                 <div class="modal-footer">
                        <input type="hidden" name="f<?php echo$id?>" value="<?php echo$id?>" id="f<?php echo$id?>">
                   <button type="submit" class="btn btn-primary btn-sm rejectBtn<?php echo$id ?>">Reject</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.rejectBtn<?php echo$id ?>').click(function (e) {
      e.preventDefault();
      var f<?php echo$id?> = $('#f<?php echo$id?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=rejectCrypto&id=<?php echo$id ?>&amount=<?php echo$rows['amount'] ?>&userid=<?php echo$userid3 ?>&coin=<?php echo$coin ?>",
          data: {"f<?php echo$id?>": f<?php echo$id ?>, },
          success: function (data) {
            $('.reject_result<?php echo$id ?>').html(data);
          }
        });
    });
  });
    </script>
                                                <?php } ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div><!-- .card-preview -->       	

   <?php } elseif($_GET['action'] == "approved_deposits") { ?>
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
                                                        
                                                        <th class="nk-tb-col"><span class="sub-text">Currency</span></th>
                                                        <th class="nk-tb-col"><span class="sub-text">User</span></th>
                                                        <th class="nk-tb-col tb-col-mb"><span class="sub-text">Amount</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Date</span></th>
                                                        
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                           

                                              <?php 
                                              $query = $conn->query("SELECT * FROM crypto_deposits WHERE status = 'success' ORDER BY id DESC");
                                                while ($rows = mysqli_fetch_array($query)) {
                                             	$userid3 = $rows['userid'];
                                             	$id = $rows['id'];
                                                $coin = $rows['coin'];
                                             	$query2 = $conn->query("SELECT * FROM cryptos WHERE code = '$coin'");
                                                $coindata = mysqli_fetch_array($query2);

                                                $query3 = $conn->query("SELECT * FROM users WHERE id = '$userid3'");
                                                $user = mysqli_fetch_array($query3);
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
                                                                    <span><?php echo $coindata['symbol']; ?></span>
                                                                </div>
                                                                <div class="user-info">
                                                                    <span class="tb-lead"><?php echo$coindata['crypto_name'] ?><span class="dot dot-success d-md-none ml-1"></span></span>
                                                                    <span><?php  ?></span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                          <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo"".$user['firstname']." ".$user['lastname']." ".$user['middlename'].""; ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo$coin ?> <span class="currency"><?php echo$rows['amount'] ?></span></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                            <span><?php echo$rows['datecreated'] ?></span>
                                                        </td>
                                                        
                                                    </tr>
                                  <?php } ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div><!-- .card-preview -->   

  <?php } elseif($_GET['action'] == "rejected_deposits") { ?>
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
                                                        
                                                        <th class="nk-tb-col"><span class="sub-text">Currency</span></th>
                                                        <th class="nk-tb-col"><span class="sub-text">User</span></th>
                                                        <th class="nk-tb-col tb-col-mb"><span class="sub-text">Amount</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Date</span></th>
                                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text">Status</span></th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                              <?php 
                                              $query = $conn->query("SELECT * FROM crypto_deposits WHERE status = 'rejected' ORDER BY id DESC");
                                                while ($rows = mysqli_fetch_array($query)) {
                                             	$userid3 = $rows['userid'];
                                             	$id = $rows['id'];
                                                $coin = $rows['coin'];
                                             	$query2 = $conn->query("SELECT * FROM cryptos WHERE code = '$coin'");
                                                $coindata = mysqli_fetch_array($query2);

                                                $query3 = $conn->query("SELECT * FROM users WHERE id = '$userid3'");
                                                $user = mysqli_fetch_array($query3);
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
                                                                    <span><?php echo $coindata['symbol']; ?></span>
                                                                </div>
                                                                <div class="user-info">
                                                                    <span class="tb-lead"><?php echo$coindata['crypto_name'] ?><span class="dot dot-success d-md-none ml-1"></span></span>
                                                                    <span><?php  ?></span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                          <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo"".$user['firstname']." ".$user['lastname']." ".$user['middlename'].""; ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo$coin ?> <span class="currency"><?php echo$rows['amount'] ?></span></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                            <span><?php echo$rows['datecreated'] ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-lg">
                                                        	<ul><button class="btn btn-sm btn-danger" <?php echo "data-toggle='modal' data-target='#approve".$id."'"; ?>>
                                                                   <em class="icon ni ni-delete"></em>Delete
                                                                    </button>
                                                                   
                                                          </ul>
                                                        </td>
                                                    </tr>
 <!--- Accept Crypto Deposit------->
 <div class="modal fade" tabindex="-1" id="approve<?php echo$id ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Delete Deposit</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Delete <?php echo $rows['coin']; echo " "; echo$rows['amount'] ?> Deposit Made by <?php echo"".$user['firstname']." ".$user['lastname']." ".$user['middlename'].""; ?> </strong>
              </div>
              <form action="" method="post">
                <div class="approve_result<?php echo$id ?>"></div>
                 <div class="modal-footer">
                        <input type="hidden" name="f<?php echo$id?>" value="<?php echo$id?>" id="f<?php echo$id?>">
                   <button type="submit" class="btn btn-primary btn-sm approveBtn<?php echo$id ?>">Delete</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.approveBtn<?php echo$id ?>').click(function (e) {
      e.preventDefault();
      var f<?php echo$id?> = $('#f<?php echo$id?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=deleteCryptoDeposit&id=<?php echo$id ?>&amount=<?php echo$rows['amount'] ?>&userid=<?php echo$userid3 ?>&coin=<?php echo$coin ?>",
          data: {"f<?php echo$id?>": f<?php echo$id ?>, },
          success: function (data) {
            $('.approve_result<?php echo$id ?>').html(data);
          }
        });
    });
  });
    </script>

                                                <?php } ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div><!-- .card-preview -->       	

  <?php } elseif($_GET['action'] == "withrawal_requests") { ?>	
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
                                                        
                                                        <th class="nk-tb-col"><span class="sub-text">Currency</span></th>
                                                        <th class="nk-tb-col"><span class="sub-text">User</span></th>
                                                        <th class="nk-tb-col tb-col-mb"><span class="sub-text">Amount</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Date</span></th>
                                                        <th class="nk-tb-col tb-col-md"><span class="sub-text">Payment Info</span></th>
                                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text">Action</span></th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                           

                                              <?php 
                                              $query = $conn->query("SELECT * FROM crypto_withdrawals WHERE status = 'pending' ORDER BY id DESC");
                                                while ($rows = mysqli_fetch_array($query)) {
                                             	$userid3 = $rows['userid'];
                                             	$id = $rows['id'];
                                                $coin = $rows['coin'];
                                             	$query2 = $conn->query("SELECT * FROM cryptos WHERE code = '$coin'");
                                                $coindata = mysqli_fetch_array($query2);

                                                $query3 = $conn->query("SELECT * FROM users WHERE id = '$userid3'");
                                                $user = mysqli_fetch_array($query3);
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
                                                                    <span><?php echo $coindata['symbol']; ?></span>
                                                                </div>
                                                                <div class="user-info">
                                                                    <span class="tb-lead"><?php echo$coindata['crypto_name'] ?><span class="dot dot-success d-md-none ml-1"></span></span>
                                                                    <span><?php  ?></span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                          <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo"".$user['firstname']." ".$user['lastname']." ".$user['middlename'].""; ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-mb" data-order="35040.34">
                                                            <span class="tb-amount"><?php echo$money ?> <span class="currency"><?php echo$rows['amount'] ?></span></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                            <span><?php echo$rows['datecreated'] ?></span>
                                                        </td>
                                                        <td class="nk-tb-col tb-col-md">
                                                            <span><?php echo$rows['wallet'] ?></span>
                                                        </td>
                                                         <td class="nk-tb-col nk-tb-col-tools">
                                                            <ul class="nk-tb-actions gx-1">
                                                                <li class="nk-tb-action-hidden">
                                                                    <a href="#" class="btn btn-trigger btn-icon" <?php echo "data-toggle='modal' data-target='#approve".$id."'"; ?> data-placement="top" title="Approve">
                                                                        <em class="icon ni ni-wallet-fill text-success"></em>
                                                                    </a>
                                                                </li>
                                                                <li class="nk-tb-action-hidden">
                                                                    <a href="#" class="btn btn-trigger btn-icon" data-placement="top" title="Reject"  <?php echo "data-toggle='modal' data-target='#reject".$id."'"; ?>>
                                                                        <em class="icon ni ni-external text-danger"></em>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                    </tr>
 <!--- Accept Crypto Withdrawal------->
 <div class="modal fade" tabindex="-1" id="approve<?php echo$id ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Approve Withdrawal</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Approve <?php echo $money; echo " "; echo$rows['amount'] ?> Withdrawal request Made by <?php echo"".$user['firstname']." ".$user['lastname']." ".$user['middlename'].""; ?> </strong>
              </div>
              <form action="" method="post">
                <div class="approve_result<?php echo$id ?>"></div>
                 <div class="modal-footer">
                        <input type="hidden" name="f<?php echo$id?>" value="<?php echo$id?>" id="f<?php echo$id?>">
                   <button type="submit" class="btn btn-primary btn-sm approveBtn<?php echo$id ?>">Approve</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.approveBtn<?php echo$id ?>').click(function (e) {
      e.preventDefault();
      var f<?php echo$id?> = $('#f<?php echo$id?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=approveCryptoWithdrawal&id=<?php echo$id ?>&amount=<?php echo$rows['amount'] ?>&userid=<?php echo$userid3 ?>&coin=<?php echo$coin ?>",
          data: {"f<?php echo$id?>": f<?php echo$id ?>, },
          success: function (data) {
            $('.approve_result<?php echo$id ?>').html(data);
          }
        });
    });
  });
    </script>

     <!--- Reject Crypto Withdrawal------->
 <div class="modal fade" tabindex="-1" id="reject<?php echo$id ?>" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <a href="#" class="close text-white" data-dismiss="modal" aria-label="Close">
                <em class="icon ni ni-cross"></em>
            </a>
            <div class="modal-header text-white" style="background-color:#033d75; color: white;">
                <h5 class="modal-title">Reject Withdrawal</h5>
            </div>
            <div class="modal-body">
               <strong>You are about to Reject <?php echo $money; echo " "; echo$rows['amount'] ?> Withdrawal request Made by <?php echo"".$user['firstname']." ".$user['lastname']." ".$user['middlename'].""; ?> </strong>
              </div>
              <form action="" method="post">
                <div class="reject_result<?php echo$id ?>"></div>
                 <div class="modal-footer">
                        <input type="hidden" name="f<?php echo$id?>" value="<?php echo$id?>" id="f<?php echo$id?>">
                   <button type="submit" class="btn btn-primary btn-sm rejectBtn<?php echo$id ?>">Reject</button>
                   <button class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                   </form>
                        </div>     
                     </div>
                 </div>
             </div>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>    
    <script type="text/javascript">
     $(document).ready(function () {
    $('.rejectBtn<?php echo$id ?>').click(function (e) {
      e.preventDefault();
      var f<?php echo$id?> = $('#f<?php echo$id?>').val();
       $.ajax
        ({
          type: "POST",
          url: "../scripts/auth.php?action=rejectCryptoWithdrawal&id=<?php echo$id ?>&amount=<?php echo$rows['amount'] ?>&userid=<?php echo$userid3 ?>&coin=<?php echo$coin ?>",
          data: {"f<?php echo$id?>": f<?php echo$id ?>, },
          success: function (data) {
            $('.reject_result<?php echo$id ?>').html(data);
          }
        });
    });
  });
    </script>
    <?php } ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div><!-- .card-preview -->       	

  <?php } else {} ?>		
  </div>
                

<?php
require_once('footer.php');
?>