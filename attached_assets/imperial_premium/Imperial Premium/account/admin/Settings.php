 <?php include("header.php"); ?>

 <div class="nk-content">
 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">General Settings.</h4>
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
                     <div class="nk-block nk-block-lg">
                                    <div class="nk-block-head">
                                        <div class="nk-block-head-content">
                                            <h4 class="title nk-block-title">Basic settings</h4>
                                            <div class="nk-block-des">
                                                <p>You can modify the basic contents of the website using the form below.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card card-bordered">
                                        <div class="card-inner">
                                            <div class="card-head">
                                                <h5 class="card-title">Website Setting</h5>
                                            </div>
                                            <form action="../scripts/update_settings" class="gy-3" id="UpdateForm" method="post">
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label" for="site-name">Base URL</label>
                                                            <span class="form-note">Specify the exact url where your website is installed.(e.g "https://example.com" for domain and "https://example.com/folder" for folder level)</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="site_url" value="<?php echo$site_url?>" name="site_url">
                                                                <?php if($site_url == ""){
                                                                    echo "<small class='text-danger'>Based url is required</small>";
                                                                } ?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label" for="site-name">Site Name</label>
                                                            <span class="form-note">Specify the name of your website. (e.g Facebook LLC)</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="sitename" value="<?php echo$sitename?>" name="sitename">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Short name</label>
                                                            <span class="form-note">Specify the Short name of your website. (eg. facebook).</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="shortname" value="<?php echo$shortname ?>" name="shortname">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Email address</label>
                                                            <span class="form-note">Specify the of your website.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="email" value="<?php echo$siteemail ?>" name="email">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Phone Number</label>
                                                            <span class="form-note">Specify the Phone number of your website.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="phone" value="<?php echo$sitephone ?>" name="phone">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                 <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Base Country</label>
                                                            <span class="form-note">Specify the base country of your Website.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <select type="text" class="form-control" id="country" name="country">
                                                                 <option value="<?php echo $sitecountry ?>" selected><?php echo$sitecountry ?></option>
                                                                 <?php require_once('country.php') ?>
                                                                  </select>  
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Enable/Disable Bots Blocker</label>
                                                            <span class="form-note">This feature will restrict Over 1000 bots from accessing your website via HTTP USER AGENT.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <ul class="custom-control-group g-3 align-center flex-wrap">
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($bots == "1"){echo "checked";} ?> value="1" name="bots" id="bots-enable">
                                                                    <label class="custom-control-label" for="bots-enable">Enable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($bots == "0"){echo "checked";} ?> value="0" name="bots" id="bots-disable">
                                                                    <label class="custom-control-label" for="bots-disable">Disable</label>
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
                                                            <label class="form-label">Description</label>
                                                            <span class="form-note">Short Description of your website.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="description"  name="description"><?php echo$sitedescription ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Site address</label>
                                                            <span class="form-note">Specify the address of your company.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="address" value="<?php echo$siteaddress ?>" name="address">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                 <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Enable or Disable Crypto Currency</label>
                                                            <span class="form-note">Enable or disable Crypto currency feature of this application.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <ul class="custom-control-group g-3 align-center flex-wrap">
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($crypto == "1"){echo "checked";} ?> value="1" name="crypto" id="crypto-enable">
                                                                    <label class="custom-control-label" for="crypto-enable">Enable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($crypto == "0"){echo "checked";} ?> value="0" name="crypto" id="crypto-disable">
                                                                    <label class="custom-control-label" for="crypto-disable">Disable</label>
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
                                                            <label class="form-label">Enable or Disable IMF & COT</label>
                                                            <span class="form-note">Enable or disable IMF and COT code feature. The system will not ask for both during transfer.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <ul class="custom-control-group g-3 align-center flex-wrap">
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($enable_cot_imf == "Yes"){echo "checked";} ?> value="Yes" name="enable_cot_imf" id="enable_cot_imf-enable">
                                                                    <label class="custom-control-label" for="enable_cot_imf-enable">Enable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($enable_cot_imf == "NO"){echo "checked";} ?> value="NO" name="enable_cot_imf" id="enable_cot_imf-disable">
                                                                    <label class="custom-control-label" for="enable_cot_imf-disable">Disable</label>
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
                                                            <label class="form-label">COT message</label>
                                                            <span class="form-note">Specify COT code procedures.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="cot"  name="cot"><?php echo$cotMsg ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">IMF message</label>
                                                            <span class="form-note">Specify IMF code procedures.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="imf"  name="imf"><?php echo$imfMsg ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">IMF message</label>
                                                            <span class="form-note">Specify IMF & COT attempt Limit.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="counter"  name="counter" value="<?php echo$imf_cot_counter ?>">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">IMF error Message</label>
                                                            <span class="form-note">Specify the error user will receive after failing to get the correct IMF code for <?php echo $imf_cot_counter ?> straight time(s).</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="imf_error"  name="imf_error"><?php echo$imf_error ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">COT error message</label>
                                                            <span class="form-note">Specify the error user will receive after failing to get the correct COT code for <?php echo $imf_cot_counter ?> straight time(s).</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="cot_error"  name="cot_error"><?php echo$cot_error ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                      <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Suspended User Error Message</label>
                                                            <span class="form-note">Specify the error message suspended user will get once they attempted to login into the their account</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="blocked_msg"  name="blocked_msg"><?php echo$blocked_msg ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                 <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">User with suspended fund transfer Error Message</label>
                                                            <span class="form-note">Specify the error message user will get once they attempted to carry out further transaction on their account after being restricted from transferring funds.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="rest_msg"  name="rest_msg"><?php echo$rest_msg ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr>

                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Enable or Disable TAC/IC/TIN</label>
                                                            <span class="form-note">Enable or disable TAC, TIN and IC code feature. Enabling this System will authomatically turn off COT/IMF.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <ul class="custom-control-group g-3 align-center flex-wrap">
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($enable_tin_ic_tac == "Yes"){echo "checked";} ?> value="Yes" name="enable_tin_ic_tac" id="enable_tin_ic_tac-enable">
                                                                    <label class="custom-control-label" for="enable_tin_ic_tac-enable">Enable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($enable_tin_ic_tac == "NO"){echo "checked";} ?> value="NO" name="enable_tin_ic_tac" id="enable_tin_ic_tac-disable">
                                                                    <label class="custom-control-label" for="enable_tin_ic_tac-disable">Disable</label>
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
                                                            <label class="form-label">Enable or Disable Insurance Code Request(IC)</label>
                                                            <span class="form-note">Enable or disable IC request during transaction.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <ul class="custom-control-group g-3 align-center flex-wrap">
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($enable_ic == "Yes"){echo "checked";} ?> value="Yes" name="enable_ic" id="enable_ic-enable">
                                                                    <label class="custom-control-label" for="enable_ic-enable">Enable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($enable_ic == "NO"){echo "checked";} ?> value="NO" name="enable_ic" id="enable_ic-disable">
                                                                    <label class="custom-control-label" for="enable_ic-disable">Disable</label>
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
                                                            <label class="form-label">Enable or Disable TIN</label>
                                                            <span class="form-note">Enable or disable Tax Indentification number request during transfer.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <ul class="custom-control-group g-3 align-center flex-wrap">
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($enable_tin == "Yes"){echo "checked";} ?> value="Yes" name="enable_tin" id="enable_tin-enable">
                                                                    <label class="custom-control-label" for="enable_tin-enable">Enable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($enable_tin == "NO"){echo "checked";} ?> value="NO" name="enable_tin" id="enable_tin-disable">
                                                                    <label class="custom-control-label" for="enable_tin-disable">Disable</label>
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
                                                            <label class="form-label">TAC Error Message</label>
                                                            <span class="form-note">Specify the message a user will get requesting for Transfer Authorization Code during funds transfer</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="tacmsg"  name="tacmsg"><?php echo$tacMsg ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">IC Error Message</label>
                                                            <span class="form-note">Specify the message a user will get requesting for Insurance Code during funds transfer</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="icmsg"  name="icmsg"><?php echo$icMsg ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">TIN Error Message</label>
                                                            <span class="form-note">Specify the message a user will get requesting for Tax Indentification Number during funds transfer</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <textarea type="text" class="form-control" id="tinmsg"  name="tinmsg"><?php echo$tinMsg ?></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Transfer Authorization Code</label>
                                                            <span class="form-note">Specify the General TAC.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="tac" value="<?php echo$userstac ?>" name="tac">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Insurance Code</label>
                                                            <span class="form-note">Specify the General Insurance Code.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="ic" value="<?php echo$usersic ?>" name="ic">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Tax Indentification Number</label>
                                                            <span class="form-note">Specify the General TIN.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="tin" value="<?php echo$userstin ?>" name="tin">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr>
                                                 <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Enable/Disable KYC</label>
                                                            <span class="form-note">Enable or disable KYC module.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <ul class="custom-control-group g-3 align-center flex-wrap">
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($kyc == "1"){echo "checked";} ?> value="1" name="kyc" id="kyc-enable">
                                                                    <label class="custom-control-label" for="kyc-enable">Enable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($kyc == "0"){echo "checked";} ?> value="0" name="kyc" id="kyc-disable">
                                                                    <label class="custom-control-label" for="kyc-disable">Disable</label>
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
                                                            <label class="form-label">Enable/Disable Visual Card</label>
                                                            <span class="form-note">Enable or disable Visual Card module.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <ul class="custom-control-group g-3 align-center flex-wrap">
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($visual_card == "1"){echo "checked";} ?> value="1" name="visual_card" id="reg-enable">
                                                                    <label class="custom-control-label" for="reg-enable">Enable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="custom-control custom-radio">
                                                                    <input type="radio" class="custom-control-input" <?php if($visual_card == "0"){echo "checked";} ?> value="0" name="visual_card" id="vc-disable">
                                                                    <label class="custom-control-label" for="vc-disable">Disable</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="row g-3">
                                                    <div class="col-lg-7 offset-lg-5">
                                                        <div id="updateResult"></div>
                                                        <div class="form-group mt-2">
                                                            <button type="submit" class="btn btn-lg btn-primary" id="btn">Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div><!-- card -->
                                </div><!-- .nk-block -->
                          
                        </div>
                    
                    
<script src="../js/jquery.min.js"></script>
<script type="text/javascript">
            $(document).ready(function (e) {
            $("#UpdateForm").on('submit',(function(e) {
            document.getElementById("btn").disabled = true; 
            e.preventDefault();
            $.ajax({
            url: "../scripts/update_settings",
            type: "POST",
            data:  new FormData(this),
            contentType: false,
            cache: false,
            processData:false,
            success: function(data)
            {
            document.getElementById("btn").disabled = false;    
            $("#updateResult").html(data);
            },
            error: function() 
            {
            }           
       });
    }));
});
</script>
 <?php include("footer.php") ?>