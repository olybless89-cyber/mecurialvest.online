 <?php include("header.php"); ?>

 <div class="nk-content">
 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Plugin Setting.</h4>
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
                                            <h4 class="title nk-block-title">Plugin configuration</h4>
                                            <div class="nk-block-des">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card card-bordered">
                                        <div class="card-inner">
                                            <div class="card-head">
                                                <h5 class="card-title">Plugin Setting</h5>
                                            </div>
                                            <form action="#" class="gy-3">
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label" for="site-name">Tawk Property ID</label>
                                                            <span class="form-note">Specify your tawk Property ID e.g(60d89fce7f4b000ac039dsc0/f6uyhb)</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="tawk" value="<?php echo$tawk?>" name="tawk">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Live Exchange Widget</label>
                                                            <span class="form-note">Specify your prefered exchange widget.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="row p-2">
                                                         <div class="col-lg-6 p-1"><small class="text-muted">Widget 1 <?php 
                                                        if ($stockrate == $rate1) {
                                                          echo "(Current)";
                                                          }else {}
                                                     ?>:</small><br><?php echo$rate1 ?></div>
                                                        <div class="col-lg-6 p-1"><small class="text-muted">Widget 2<?php 
                                                        if ($stockrate != $rate1) {
                                                          echo "(Current)";
                                                          }else {}
                                                     ?>:</small><br><?php echo$rate2 ?></div>
                                                        </div>
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <select type="text" class="form-control form-control-xl" id="stockrate" value="" name="stockrate">
                                                                    <?php if($stockrate == $rate1){
                                                                        echo "<option value='1' selected>Widget 1</option>";
                                                                    }else{
                                                                     echo "<option value='2' selected>Widget 2</option>";   
                                                                    } ?>
                                                                    <option value="1">Widget 1</option>
                                                                    <option value="2">Widget 2</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3">
                                                    <div class="col-lg-7 offset-lg-5">
                                                        <div class="updateResult"></div>
                                                        <div class="form-group mt-2">
                                                            <button type="submit" class="btn btn-lg btn-primary puginBtn">Update</button>
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
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
 <script type="text/javascript">                
 $(document).ready(function() {
 $('.puginBtn').on('click', function() {
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
    $('.puginBtn').click(function (e) {
      e.preventDefault();
      var tawk = $('#tawk').val();
      var stockrate = $('#stockrate').val();
      $.ajax
        ({
          type: "POST",
          url: "../scripts/plugin",
          data: {"tawk": tawk, "stockrate": stockrate},
          success: function (data) {
            $('.updateResult').html(data);
            $('#form')[0].reset();
          }
        });
    });
  });
  </script>
 <?php include("footer.php") ?>