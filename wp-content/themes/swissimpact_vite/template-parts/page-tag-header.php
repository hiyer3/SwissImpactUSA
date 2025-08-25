<header class="flex pb-16 relative justify-center min-h-half-screen sm:min-h-sm-custom md:min-h-auto pt-16 md:pt-32 bg-header-left bg-swissred" style="background-image: url('<?php echo get_template_directory_uri(); ?>/assets/img/home/hero-bg-inverse-2x.jpg');">
    <?php
    echo get_template_part('template-parts/nav', 'menu')
    ?>

    <?php
    echo get_template_part('template-parts/nav', 'share')
    ?>

    <div class="md:flex w-10/12 mx-auto md:w-11/12 lg:mr-0 pt-5 pb-20 md:pb-0">
        <div class="w-full md:w-8/12">
            <h1 class="title"><?php echo strtoupper(single_tag_title()); ?></h1>
            <div class="text-white">
                <?php echo types_render_termmeta('tag-taxonomy-description'); ?>
            </div>
        </div>
    </div>
</header>