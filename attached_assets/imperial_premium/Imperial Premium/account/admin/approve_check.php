<?php include("header.php"); ?>
<div class="nk-content">

 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Approve Check Deposit. (<?php echo$_GET['refNumber'] ?>)</h4>
                <div class="nk-block-des">
                  <p>
                   </p>
                      </div>
                       </div>
                            <div class="nk-block-head-content">
                                        <ul class="nk-block-tools gx-3">
                                            <li><a onclick="window.history.go(-1);" class="btn btn-primary"><span>Back</span> <em class="icon ni ni-arrow-left"></em></a></li>
                                            <li><a href="fund_user" class="btn btn-success"><span>Fund an account</span> <em class="icon ni ni-invest"></em></a></li>
                                        </ul>
                                    </div><!-- .nk-block-head-content -->
                                </div><!-- .nk-block-between -->
                            </div><!-- .nk-block-head -->
                        </div>
                    </div>
 <?php 
 $ref = $_GET['refNumber'];
  $sql = $conn->query("SELECT * FROM check_deposit WHERE ref = '$ref'");
  $rows = mysqli_fetch_array($sql);
    $userid = $rows['user_id'];
      $sqll = $conn->query("SELECT * FROM users WHERE id = '$userid'");
      $ro = mysqli_fetch_array($sqll);
      $firstname = $ro['firstname']; $middlename = $ro['middlename']; $lastname = $ro['lastname'];


 ?>
<ul class="buysell-pm-list">
   <li class="buysell-pm-item">
       <label class="buysell-pm-label" for="pm-paypal">
         <span class="pm-name">Account Holder</span>
          <span class="pm-icon"><?php echo "$firstname $middlename $lastname"; ?></span>
          </label>
         </li>
         <li class="buysell-pm-item">
         <label class="buysell-pm-label" for="pm-bank">
           <span class="pm-name">Check Number</span>
              <span class="pm-icon"><?php echo$rows['check_number']; ?></span>
            </label>
           </li>
          <li class="buysell-pm-item">
           <label class="buysell-pm-label" for="pm-card">
            <span class="pm-name">Amount</span>
            <span class="pm-icon"><?php echo$money ?> <?php echo$rows['amount']; ?></span>
            </label>
           </li>
        </ul>
        <div class="row">
        	<div class="col-lg-4 p-2">
        	<form method="post" action="">
            <div class="custom-control custom-control-lg custom-switch">
               <input type="checkbox" checked="" class="custom-control-input" id="customSwitch2" name="customSwitch2">
                <label class="custom-control-label" for="customSwitch2">Send email notification</label>
              </div>
            	<div class="approveResult p-2"></div>	
              <input type="hidden" name="amount" id="amount" value="<?php echo$rows['amount'] ?>">
              <input type="hidden" name="id" id="id" value="<?php echo$userid ?>">
        	<input type="hidden" name="refNumber" value="<?php echo$_GET['refNumber'] ?>" id="refNumber">
            <button class="btn btn-success approveBtn">Approve</button>
        </form>
    </div>
           </div>
</div>
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
 <script type="text/javascript">               	
 $(document).ready(function() {
 $('.approveBtn').on('click', function() {
 var $this = $(this);
 var loadingText = '<i class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i>&nbsp;Processing...';
 if ($(this).html() !== loadingText) {
 $this.data('original-text', $(this).html());
 $this.html(loadingText);
 }
 setTimeout(function() {
 $this.html($this.data('original-text'));
 },2000);
 });
 })
$(document).ready(function () {
    $('.approveBtn').click(function (e) {
      e.preventDefault();
      var refNumber = $('#refNumber').val();
      var customSwitch2 = $('#customSwitch2').val();
      var id = $('#id').val();
      var amount = $('#amount').val();
      $.ajax
        ({
          type: "POST",
          url: "../scripts/approve_check",
          data: {"refNumber": refNumber, "customSwitch2": customSwitch2, "id": id, "amount": amount},
          success: function (data) {
            $('.approveResult').html(data);
            $('#form')[0].reset();
          }
        });
    });
  });
  </script>
<?php include("footer.php"); ?>