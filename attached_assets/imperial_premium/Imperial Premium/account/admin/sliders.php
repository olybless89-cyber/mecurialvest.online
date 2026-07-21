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
              <h4 class="nk-block-title fw-normal">Home page slider</h4>
                <div class="nk-block-des">
                  <p>
                   </p>
                      </div>
                       </div>
                            <div class="nk-block-head-content">
                                        <ul class="nk-block-tools gx-3">
                                            <li><a href="transactions" class="btn btn-primary"><span>Transactions</span> <em class="icon ni ni-tranx"></em></a></li>
                                        </ul>
                                    </div><!-- .nk-block-head-content -->
                                </div><!-- .nk-block-between -->
                            </div><!-- .nk-block-head -->
                        </div>
                    </div>
	 <div class="card card-bordered card-preview">
                     <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
                       <h5 class="text-white"> <em class="icon ni ni-camera-fill"></em>Home page Sliders</h5>
                    </div>
                    <div class="card-body">
                      <table class="datatable-init table">
                  <thead>
                    <tr>
                     <th>Image</th>
                       <th>Heading</th>
                      <th>Content</th>
                      <th>Action</th>
                  </tr>
                </thead>
                 <tbody>
                    <?php 
                    $query = $conn->query("SELECT * FROM sliders ORDER BY id ASC");
                     while ($rows = mysqli_fetch_array($query)) {
                                          ?>
                    <tr>
                      <td><img src="../<?php echo$rows['picture']; ?>" height="100"></td>    
                      <td><?php echo$rows['heading']; ?></td>  
                      <td><?php echo$rows['content'] ?></td>
                      <td><a class="btn btn-primary btn-sm" href="edit_slider?id=<?php echo$rows['id'] ?>"><em class="icon ni ni-edit"></em> Edit</a>
                      	<br>
                      	<br>
                      
                      </td>
                      </tr> 
                   <?php } ?>
                   </tbody>
                   </table>
                   </div>
                   </div> 
                   </div>  
<?php 
include("footer.php");
?>