<?php require_once'header.php'; ?>
 <!-- content @s -->
                <div class="nk-content nk-content-fluid">
                    <div class="container-xl wide-lg">
                        <div class="nk-content-body">
                            <div class="components-preview wide-md mx-auto">
                                <div class="nk-block-head nk-block-head-lg wide-sm">
                                    <div class="nk-block-head-content">
                                        <div class="nk-block-head-sub"><a class="back-to" href="users"><em class="icon ni ni-arrow-left"></em><span>Back to Home</span></a></div>
                                    </div>
                                </div><!-- .nk-block -->
                                   <div class="nk-block nk-block-lg">
                                    <div class="nk-block-head">
                                        <div class="nk-block-head-content">
                                            <h4 class="title nk-block-title">Loan Management</h4>
                                            <div class="nk-block-des">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card card-bordered">
                                        <div class="card-inner">
                                            <div class="card-head">
                                                <h5 class="card-title">Loan Configuration</h5>
                                            </div>
                                            <form action="../scripts/auth?action=loanSetting" class="gy-3" id="loanUpdateForm" method="post">
                                            	 <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Allow Loan Application Module</label>
                                                            <span class="form-note">Enable or disable loan Applcation Feature on your website.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <ul class="custom-control-group g-3 align-center flex-wrap">
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($loan == "1"){echo "checked";} ?> value="1" name="loan" id="reg-enable">
                                                                    <label class="custom-control-label" for="reg-enable">Enable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($loan == "0"){echo "checked";} ?> value="0" name="loan" id="reg-disable">
                                                                    <label class="custom-control-label" for="reg-disable">Disable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label" for="site-name">Minimum Amount <?php echo"($money)"; ?></label>
                                                            <span class="form-note">Specify the Loan Application Amount.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="number" step="any" class="form-control" required  value="<?php echo$loan_mini ?>" name="loan_mini">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Maximum Amount <?php echo"($money)"; ?></label>
                                                            <span class="form-note">Specify the Maximum loan application amount.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="number" step="any" class="form-control" id="site-email" value="<?php echo$loan_maxi ?>" name="loan_maxi" required>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Interest Rate (%)</label>
                                                            <span class="form-note">Specify the interest rate percentage on monthly Basis</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="site-copyright" value="<?php echo$interest_rate ?>" name="interest_rate" required>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Management Fee (%)</label>
                                                            <span class="form-note">Specify the Mangement Fee</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" name="mana_fee" value="<?php echo$mana_fee ?>" required>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Credit Insurance  Fee (%)</label>
                                                            <span class="form-note">Specify the Credit Insurance Fee</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" name="insurance" value="<?php echo$insurance ?>" required>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Penal Charge (%)</label>
                                                            <span class="form-note">Specify Penal Charge in percentage on each loan request</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" name="penal_charge" value="<?php echo$penal_charge ?>" required>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                              <div id="Result"></div>
                                                <div class="row g-3">
                                                    <div class="col-lg-7 offset-lg-5">
                                                        <div class="form-group mt-2">
                                                            <button type="submit" class="btn btn-lg btn-primary" id="btn">Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div><!-- card -->
                                </div><!-- .nk-block -->
                            </div><!-- .components-preview -->
                        </div>
                    </div>
                </div>
                <script src="../js/jquery.min.js"></script>
         <script type="text/javascript">
            $(document).ready(function (e) {
        	$("#loanUpdateForm").on('submit',(function(e) {
        	document.getElementById("btn").disabled = true;	
		    e.preventDefault();
		    $.ajax({
        	url: "../scripts/auth?action=loanSetting",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
		    document.getElementById("btn").disabled = false;	
			$("#Result").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	}));
});
</script>
<?php require_once'footer.php'; ?>