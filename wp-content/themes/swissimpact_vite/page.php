<?php get_header() ?>

<section class="bg-cover bg-pos-strips bg-no-repeat" style="background-image: url(<?php echo get_template_directory_uri(); ?>/assets/img/backpages/stripes.png);">
    <div class="w-11/12 md:w-10/12 mx-auto pt-20 pb-10 post-content">
        <?php the_content(); ?>
    </div>

    <?php echo get_template_part('template-parts/post', 'recommendations'); ?>
</section>

<?php get_footer() ?>