<?php 
include("header.php");
error_reporting(0);
?>
 <!-- content @s -->
 <?php
if($_GET['id'] != ""){

  ?>
                <div class="nk-content nk-content-fluid">
                    <div class="container-xl wide-lg">
                        <div class="nk-content-body">
                            <div class="buysell wide-xs m-auto">
                                <div class="buysell-nav text-center">
                                    <ul class="nk-nav nav nav-tabs nav-tabs-s2">
                                        <li class="nav-item">
                                            <a class="nav-link">Credit Account</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="debit_user?accountnumber=<?php echo$_GET['accountnumber'] ?>&id=<?php echo$_GET['id'] ?>">Debit Account</a>
                                        </li>
                                    </ul>
                                </div><!-- .buysell-nav -->
                                <?php 
                                	$id = $_GET['id'];
                                    $query = $conn->query("SELECT * FROM users WHERE id = '$id'");
                                    $details = mysqli_fetch_array($query);
                                    $firstname = $details['firstname'];
                                    $middlename = $details['middlename'];
                                    $lastname = $details['lastname'];
                                    $accountbalance = $details['accountbalance'];
                                    $email = $details['email'];
                                	 ?>
                                <div class="buysell-title text-center">
                                    <h2 class="title">Send money to <?php echo "$firstname $lastname $middlename"; ?>!</h2>
                                </div><!-- .buysell-title -->
                                <div class="buysell-block">
                                	
                                    <form action="" class="buysell-form" method="post">
                                        <div class="buysell-field form-group">
                                            <div class="form-label-group">
                                                <label class="form-label">Account:</label>
                                            </div>
                                            <input type="hidden" value="<?php echo$_GET['id'] ?>" name="id" id="id">
                                            <div class="dropdown buysell-cc-dropdown">
                                                <a href="#" class="buysell-cc-choosen dropdown-indicator">
                                                    <div class="coin-item coin-btc">
                                                        <div class="coin-icon">
                                                            <em class="icon ni ni-wallet-fill"></em>
                                                        </div>
                                                       <div class="coin-info">
                                                            <span class="coin-name"><?php  echo "$firstname $lastname $middlename";  ?></span>
                                                            <span class="coin-text">Current Balance: <?php echo$accountbalance ?></span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div><!-- .dropdown -->
                                        </div><!-- .buysell-field -->
                                        <div class="buysell-field form-group">
                                            <div class="form-label-group">
                                                <label class="form-label" for="buysell-amount">Amount to Credit</label>
                                            </div>
                                            <div class="form-control-group">
                                                <input type="number" class="form-control form-control-lg form-control-number" id="amount" name="amount" placeholder="2000">
                                                <div class="form-dropdown">
                                                    <div class="text"><?php echo$money ?><span></span></div>
                                                </div>
                                            </div>
                                         
                                        </div>
                                        <div class="buysell-field form-group">
                                            <div class="form-label-group">
                                                <label class="form-label">Transfer Scope</label>
                                            </div>
                                            <div class="buysell-field form-group">
                                            <div class="form-label-group">
                                            </div>
                                            <div class="form-control-group">
                                                <select type="number" class="form-control form-control-lg form-control-number" id="scope" name="scope">
                                                  <option>Local Transfer</option>
                                                  <option>Check Deposit</option>
                                                  <option>Internation Transfer</option>
                                                </select>
                                                <div class="form-dropdown">
                                                    <div class="text">Scope<span></span></div>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                          <div class="buysell-field form-group">
                                            <div class="form-label-group">
                                                <label class="form-label" for="buysell-amount">Description</label>
                                            </div>
                                            <div class="form-control-group">
                                                <input type="text" class="form-control form-control-lg form-control-number" id="memo" name="Memo" placeholder="the purpose of your transfer">
                                                <div class="form-dropdown">
                                                    <div class="text">Memo<span></span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="buysell-field form-group">
                                            <div class="form-label-group">
                                                <label class="form-label" for="buysell-amount">frequency</label>
                                            </div>
                                            <div class="form-control-group">
                                                <select type="text" class="form-control form-control-lg form-control-number" id="frequency" name="frequency">
                                                 <option>1</option>
                                                 <option>2</option>
                                                 <option>5</option>
                                                 <option>8</option>
                                                 <option>10</option>
                                                </select>
                                                <div class="form-dropdown">
                                                    <div class="text">Frequency<span></span></div>
                                                </div>
                                            </div>
                                        </div>
                                          <div class="buysell-field form-group">
                                            <div class="form-label-group">
                                                <label class="form-label" for="buysell-amount">Send Email Notification</label>
                                            </div>
                                            <div class="form-control-group">
                                                <select type="text" class="form-control form-control-lg form-control-number" id="emailnotify" name="emailnotify">
                                                 <option>No</option>
                                                 <option>Yes</option>
                                                
                                                </select>
                                                <div class="form-dropdown">
                                                    <div class="text">Email<span></span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="creditUserResult"></div>
                                        <div class="buysell-field form-action">
                                            <button type="submit" class="btn btn-lg btn-block btn-primary creditUserBtn">Continue</a>
                                        </div><!-- .buysell-field -->
                                        <div class="form-note text-base text-center">Note: our transfer fee included.</div>
                                    </form><!-- .buysell-form -->
                                </div><!-- .buysell-block -->
                            </div><!-- .buysell -->
                        </div>
                    </div>
                </div>
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
 <script type="text/javascript">               	
 $(document).ready(function() {
 $('.creditUserBtn').on('click', function() {
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
    $('.creditUserBtn').click(function (e) {
      e.preventDefault();
      var id = $('#id').val();
      var scope = $('#scope').val();
      var memo = $('#memo').val();
      var amount = $('#amount').val();
      var frequency = $('#frequency').val();
      var emailnotify = $('#emailnotify').val();
      $.ajax
        ({
          type: "POST",
          url: "../scripts/credit-user",
          data: {"id": id, "scope": scope, "memo": memo, "amount": amount, "frequency": frequency, "emailnotify": emailnotify},
          success: function (data) {
            $('.creditUserResult').html(data);
            $('#form')[0].reset();
          }
        });
    });
  });
  </script>
<?php } else { ?>
           <div class="nk-content">
            <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Select any user from this list to start funding it.</h4>
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
              <div class="card card-preview ">
              <div class="card-inner p-0">
                <table class="datatable-init table">
                  <thead>
                    <tr>
                     <th>Account Name</th>
                       <th>Account Number</th>
                      <th>Account balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                 <tbody>
                    <?php 
                    $query = $conn->query("SELECT * FROM users WHERE id  != 1 ORDER BY id DESC");
                     while ($rows = mysqli_fetch_array($query)) {     
                    ?>
                    <tr>
                      <td><?php echo$rows['firstname']; ?> <?php echo$rows['middlename']; ?> <?php echo$rows['lastname']; ?></td>    
                      <td><?php echo$rows['accountnumber']; ?></td>  
                      <td><b><?php echo$money; ?></b> <?php echo$rows['accountbalance'] ?></td> 
                      <td><a href="fund_user?accountnumber=<?php echo$rows['accountnumber'] ?>&id=<?php echo$rows['id']; ?>" class="btn btn-success btn-sm">Fund User</a></td> 
                      </tr> 
              <?php   }   ?>
          </tbody>
      </table>
      </div>
  </div>
</div>
         <?php } ?>
<?php
include("footer.php");

?>	