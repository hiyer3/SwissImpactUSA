<header class="flex pb-16 relative justify-center min-h-half-screen sm:min-h-sm-custom md:min-h-auto pt-32 bg-header-left bg-no-repeat bg-swissred" style="background-image: url('<?php echo get_template_directory_uri(); ?>/assets/img/home/hero-bg-inverse-2x.jpg');">
    <?php
    echo get_template_part('template-parts/nav', 'menu')
    ?>

    <?php
    echo get_template_part('template-parts/nav', 'share')
    ?>

    <div class="md:flex w-10/12 mx-auto md:w-11/12 lg:mr-0">
        <div class="w-full md:w-8/12">
            <h1 class="title">Search</h1>
            <h1 class="text-white"><?php echo get_search_query(); ?></h1>
        </div>
    </div>
</header>