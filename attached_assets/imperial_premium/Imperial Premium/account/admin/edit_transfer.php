<?php
include("header.php");
                                           

                                          $refNumber = $_GET['refNumber'];

                                           $query = $conn->query("SELECT * FROM transactions WHERE refNumber = '$refNumber'");
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
                                             $status = $rows['status'];
                                             if($status == 1){
                                             	$stat = "completed";
                                             }else{$stat = "pending";}
                                         }
                                             ?>
<div class="nk-content">
 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Edit transaction   (<?php echo$_GET['refNumber']?>).</h4>
                <div class="nk-block-des">
                  <p>
                   </p>
                      </div>
                       </div>
                            <div class="nk-block-head-content">
                                        <ul class="nk-block-tools gx-3">
                                            <li><a  class="btn btn-primary"  onclick="window.history.go(-1); return false;" style="cursor: pointer;"><span>Back</span> <em class="icon ni ni-arrow-left"></em></a></li>
                                            <li><a href="fund_user" class="btn btn-success"><span>Fund an account</span> <em class="icon ni ni-invest"></em></a></li>
                                        </ul>
                                    </div><!-- .nk-block-head-content -->
                                </div><!-- .nk-block-between -->
                            </div><!-- .nk-block-head -->
                        </div>
                    </div>
        <div class="card card-bordered p-0">
          <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
          	<h5 class="text-white">Edit transaction</h5>
        </div>
        <div class="card-body">
           <div class="row">
                <div class="col-md-4">
                      <div class="form-group">
                      <label class="form-label" for="email">Ref number</label>
                    <input type="text" class="form-control form-control-lg" name="refNumber" id="refNumber" value="<?php echo$refNumber ?>">
                   </div>
               </div>
                <div class="col-md-4">
                      <div class="form-group">
                      <label class="form-label" for="email">Amount</label>
                    <input type="text" class="form-control form-control-lg" name="amount" id="amount" value="<?php echo$amount ?>">
                   </div>
               </div>
                <div class="col-md-4">
                      <div class="form-group">
                      <label class="form-label" for="email">Date</label>
                    <input type="text" class="form-control form-control-lg" name="dated" id="dated" value="<?php echo$dated ?>">
                   </div>
               </div>
                <div class="col-md-12">
                      <div class="form-group">
                      <label class="form-label" for="email">Description</label>
                    <input type="text" class="form-control form-control-lg" name="description" id="description" value="<?php echo$description ?>">
                   </div>
               </div>
                <div class="col-md-4">
                      <div class="form-group">
                      <label class="form-label" for="email">Scope</label>
                    <input type="text" class="form-control form-control-lg" name="scope" id="scope" value="<?php echo$scope ?>">
                   </div>
               </div>
                <div class="col-md-4">
                      <div class="form-group">
                      <label class="form-label" for="email">Type</label>
                    <select type="text" class="form-control form-control-lg" name="type" id="type">
                        <option selected><?php echo$type; ?></option>
                        <?php if($type == "Credit"){ 
                        echo "<option>Debit</option>";}
                        else {echo "<option>Credit</option>";}
                        ?>
                        </select>
                   </div>
               </div>
                <div class="col-md-4">
                      <div class="form-group">
                      <label class="form-label" for="email">Status</label>
                    <select type="text" class="form-control form-control-lg" name="status" id="status" value="">
                    <option value="<?php echo$status ?>"><?php echo$stat ?></option>
                    <option value="0">Pending</option>
                    <option value="1">Completed</option>
                    </select>
                   </div>
               </div>
           </div>
          
        </div>
        <div class="UpdateTransferResult"></div>
         <div class="card-footer">
           	<button type="submit" class="btn btn-lg btn-primary UpdateTransfer">Update</button>
           </div>
     </div>
                </div>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
 <script type="text/javascript">               	
 $(document).ready(function() {
 $('.UpdateTransfer').on('click', function() {
 var $this = $(this);
 var loadingText = '<i class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i>&nbsp;Processing...';
 if ($(this).html() !== loadingText) {
 $this.data('original-text', $(this).html());
 $this.html(loadingText);
 }
 setTimeout(function() {
 $this.html($this.data('original-text'));
 },3000);
 });
 })
$(document).ready(function () {
    $('.UpdateTransfer').click(function (e) {
      e.preventDefault();
      var refNumber = $('#refNumber').val();
      var amount = $('#amount').val();
      var dated = $('#dated').val();
      var description = $('#description').val();
      var scope = $('#scope').val();
      var type = $('#type').val();
      var status = $('#status').val();
      $.ajax
        ({
          type: "POST",
          url: "../scripts/update-transfer",
          data: {"refNumber": refNumber, "amount": amount, "dated": dated, "description": description, "scope": scope, "type": type, "status": status},
          success: function (data) {
            $('.UpdateTransferResult').html(data);
            $('#form')[0].reset();
          }
        });
    });
  });
  </script>

<?php include("footer.php"); ?>