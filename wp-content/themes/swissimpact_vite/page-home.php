<?php

/**
 * Template Name: Homepage
 */
?>
<?php get_header(); ?>

<?php if (have_posts()) : the_post(); ?>

    <header class="flex pb-8 relative justify-center min-h-half-screen sm:min-h-sm-custom md:min-h-auto pt-16">
        <?php
        echo get_template_part('template-parts/nav', 'menu')
        ?>

        <?php
        echo get_template_part('template-parts/nav', 'share')
        ?>

        <div class="flex flex-col items-center logo-wrapper">
            <div class="logo text-center pt-10 md:pt-5">
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/Swiss-Impact-Logo-KO-RGB@2x.png" class="img hero-logo" alt="Swiss Impact Logo" />
                </figure>
            </div>

            <div class="pt-12 pb-56 md:pb-14">
                <a href="/explore-swiss-impact-by-the-numbers/" class="btn transparent">SWISS IMPACT By the Numbers</a>
            </div>

            <div class="absolute md:relative bottom-3 md:bottom-0">
                <picture>
                    <source type="image/webp" srcset="<?php echo get_template_directory_uri(); ?>/assets/img/home/hero-scroll-down-2x.webp" />
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/hero-scroll-down-2x.png" class="img w-16 scroll-down" />
                </picture>
            </div>
        </div>

    </header>

    <main class="flex-grow mb-8 pt-10">

        <?php the_content();  ?>

    </main>

<?php endif; ?>

<?php get_footer(); ?>