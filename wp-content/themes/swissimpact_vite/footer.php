   <div class="stay-in-touch py-6">
       <div class="w-10/12 mx-auto flex flex-col lg:flex-row justify-center items-center gap-4">
           <h3 class="text-white text-center lg:text-left">Stay in touch</h3>
           <div class="email-wrapper mx-auto lg:mx-0 flex">
               <!--input name="input-email" type="email" placeholder="Email" />
               <button class="email-submit">Submit</button-->
               <?php echo do_shortcode('[gravityform id="1" title="false" description="false" ajax="true"]'); ?>
           </div>
       </div>
   </div>


   <footer class="bg-black text-white">
       <div class="w-11/12 lg:w-10/12 mx-auto pt-8 pb-8 md:py-16 lg:flex gap-16">
           <div class="w-full md:w-full lg:w-2/4 widget-area">
               <?php if (is_active_sidebar('footer_widget_1')) :  ?>
                   <?php dynamic_sidebar('footer_widget_1'); ?>
               <?php endif; ?>
           </div>

           <div class="w-full mt-8 lg:mt-0 lg:w-3/12 widget-area">
               <?php if (is_active_sidebar('footer_widget_2')) :  ?>
                   <?php dynamic_sidebar('footer_widget_2'); ?>
               <?php endif; ?>
           </div>

           <div class="w-full mt-8 lg:mt-0 lg:w-3/12 widget-area area-3">
               <?php if (is_active_sidebar('footer_widget_3')) :  ?>
                   <?php dynamic_sidebar('footer_widget_3'); ?>
               <?php endif; ?>
           </div>
       </div>
       <div class="w-11/12 md:w-10/12 mx-auto pb-16 flex-col md:flex-row flex gap-8 md:gap-16">
           <div class="w-full md:w-1/2 flex flex-col justify-end order-2 md:order-1">
               <p class="text-xs text-center md:text-left">© <?php echo date("Y"); ?> SWISS IMPACT. All Rights Reserved</p>
           </div>
           <div class="w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2">
               <a href="https://www.eda.admin.ch/eda/en/fdfa/fdfa/organisation-fdfa/general-secretariat/presence-switzerland.html" target="_blank" class="text-center md:mr-4">
                   <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/footer-swiss-logo-2x.png" alt="Swiss Logo" class="img w-16 mx-auto" />
                   <p class="text-xs mt-3">Supported by Presence Switzerland</p>
               </a>
           </div>
       </div>
   </footer>

   <?php if (IS_VITE_DEVELOPMENT) : ?>
       <div class="container mx-auto text-center my-5">
           <p class="text-xs">Currently in <strong><?php echo (IS_VITE_DEVELOPMENT) ? "development" : "production" ?></strong> mode.</p>
       </div>
   <?php endif; ?>
   </section>
   <?php wp_footer() ?>
   </body>

   </html>