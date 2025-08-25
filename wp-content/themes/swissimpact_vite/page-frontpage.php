<?php

/**
 * Template Name: Home
 */
?>
<?php get_header() ?>


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

        <div class="pt-12 pb-20">
            <a href="#experience-swiss-impact" class="btn transparent">Experience SWISS IMPACT</a>
        </div>

        <div class="absolute md:relative bottom-3 md:bottom-0">
            <picture>
                <source srcset="<?php echo get_template_directory_uri(); ?>/assets/img/home/hero-scroll-down-2x.webp" />
                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/hero-scroll-down-2x.png" class="img w-16 scroll-down" />
            </picture>
        </div>
    </div>

</header>

<main class="flex-grow mb-8">

    <div class="intro w-11/12 md:w-8/12 mx-auto py-10">
        <h3 class="pb-1">Welcome to SWISS IMPACT!</h3>
        <p class="pt-2 text-justify">We invite you to discover Switzerland's positive impact across the United States and to learn more about Swiss innovation, sustainability, economic relations, and humanitarianism, as well as its diverse culture. Whether you are an expert on Switzerland or just know about its famous chocolate and cheese, we are excited to tell you more about what we do in the United States and how you can take part in our many events and activities. Explore our great programming below, learn more about the excellent relationship between Switzerland and the United States, and be sure to secure your spot at one of our upcoming public events!</p>
    </div>

    <div class="slider-wrapper w-11/12 mx-auto lg:mr-0" id="highlights">
        <div class="title flex">
            <h1 class="inline-block">SWISS IMPACT highlights</h1>
            <div class="swiper-nav inline-flex gap-7 ml-5">
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
        <div class="slider w-swiper">
            <?php
            $args = array(
                'post_type' => 'post',
                'posts_per_page' => 6,
                'meta_key' => 'wpcf-event-to-date',
                'orderby' => 'meta_value_num',
                'order' => 'DESC',
                'meta_query' => array(
                    array(
                        'key' => 'wpcf-is-featured-event',
                        'value' => '1',
                        'compare' => '='
                    )
                ),
            );

            $featured_posts = new WP_Query($args);

            if (!$featured_posts->have_posts()) {
                $args = array(
                    'post_type' => 'post',
                    'meta_key' => 'wpcf-event-to-date',
                    'orderby' => 'meta_value_num',
                    'order' => 'DESC',
                );
                $featured_posts = new WP_Query($args);
            }
            ?>

            <?php
            if ($featured_posts->have_posts()) :
            ?>
                <div class="swiper-wrapper">
                    <?php
                    while ($featured_posts->have_posts()) : $featured_posts->the_post();
                        echo get_template_part('template-parts/get', 'slider-post');
                    endwhile ?>
                </div>
            <?php else : ?>
                <div class="grid grid-cols-1 gap-x-16 gap-y-10">
                    <h3>Watch out this space for upcoming events.</h3>
                </div>
            <?php endif; ?>
            <?php wp_reset_postdata(); ?>

        </div>
    </div>

    <div class="w-11/12 md:w-10/12 mx-auto mt-10 mb-10 pt-5 lg:pt-20">
        <p class="pb-3">
            Did you know that Switzerland is the 7th largest Foreign Direct Investor in the United States, that the country has four national languages, and that it is home to the International Committee of the Red Cross as well as the European headquarters of the United Nations? Did you also know that thanks to its innovative spirit, Switzerland has the longest tunnel in the world and is one of the most sustainable countries in the world?
        </p>
        <p>
            Learn more about the positive impact of Switzerland in the various fields by clicking on the icons below.
        </p>
    </div>

    <div id="experience-swiss-impact" class="grid grid-cols-2 lg:grid-cols-3 relative">
        <div class="category">
            <a class="block" href="<?php echo get_site_url(); ?>/category/innovative-impact/">
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-innovation-blue-2x.webp" class="img  w-full" alt="Innovative" />
                </figure>
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-innovation-color-2x.webp" class="img w-full hidden" alt="Innovative" />
                </figure>
                <div class="cat-title lg:hidden">
                    Innovation
                </div>
            </a>
        </div>
        <div class="category">
            <a class="block" href="<?php echo get_site_url(); ?>/category/sustainability/">
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-sustainability-blue-2x.webp" class="img  w-full" alt="Sustainability" />
                </figure>
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-sustainability-color-2x.webp" class="img  w-full hidden" alt="Sustainability" />
                </figure>
                <div class="cat-title lg:hidden">
                    Sustainability
                </div>
            </a>
        </div>
        <div class="category">
            <a class="block" href="<?php echo get_site_url(); ?>/category/economic-relations/">
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-economic-blue-2x.webp" class="img  w-full" alt="Economic" />
                </figure>
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-economic-color-2x.webp" class="img  w-full hidden" alt="Economic" />
                </figure>
                <div class="cat-title lg:hidden">
                    Economic
                </div>
            </a>
        </div>
        <div class="category">
            <a class="block" href="<?php echo get_site_url(); ?>/category/humanitarianism/">
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-humanitarian-blue-2x.webp" class="img  w-full" alt="Humanitarian" />
                </figure>
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-humanitarian-color-2x.webp" class="img  w-full hidden" alt="Humanitarian" />
                </figure>
                <div class="cat-title lg:hidden">
                    Humanitarian
                </div>
            </a>
        </div>
        <div class="category hidden lg:block">

        </div>
        <div class="category">
            <a class="block" href="<?php echo get_site_url(); ?>/category/culture/">
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-cultural-blue-2x.webp" class="img w-lg" alt="Cultural" />
                </figure>
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-cultural-color-2x.webp" class="img w-lg hidden" alt="Cultural" />
                </figure>
                <div class="cat-title lg:hidden">
                    Cultural
                </div>
            </a>
        </div>
        <div class="absolute text-xs text-white bottom-2 right-2 attribute">
            Projection by Swiss light artist Gerry Hofstetter
        </div>
    </div>

    <div class="w-11/12 md:w-10/12 mx-auto py-10">
        <h1>Upcoming Events</h1>

        <?php
        $args = array(
            'post_type' => 'post',
            'posts_per_page' => 3,
            'meta_key' => 'wpcf-event-to-date',
            'orderby' => 'meta_value_num',
            'order' => 'ASC',
        );

        $upcoming_posts = new WP_Query($args);
        ?>

        <?php
        if ($upcoming_posts->have_posts()) :
        ?>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <?php
                while ($upcoming_posts->have_posts()) : $upcoming_posts->the_post();
                    echo get_template_part('template-parts/get', 'post');
                endwhile;
                ?>
            </div>
        <?php else : ?>
            <div class="grid grid-cols-1 gap-x-16 gap-y-10 mb-5">
                <h3>Watch out this space for upcoming events.</h3>
            </div>
        <?php endif; ?>

        <p class="text-center">
            <a href="<?php echo get_site_url(); ?>/events" class="btn">SEE ALL UPCOMING EVENTS</a>
        </p>
    </div>

    <div class="w-11/12 md:w-10/12 mx-auto py-10">
        <h1>Past Events</h1>

        <?php 
        $args = array(
            'post_type' => 'post',
            'posts_per_page' => 3,
            'meta_key' => 'wpcf-event-from-date',
            'orderby' => 'meta_value_num',
            'order' => 'DESC',
            'meta_query' => array(
                array(
                    'key' => 'wpcf-event-to-date',
                    'value' => todayUnixDate(),
                    'compare' => '<', 
                    'type' => 'UNSIGNED'
                )
            ),
        );

        $past_posts = new WP_Query($args);
        ?>

        <?php
        if ($past_posts->have_posts()) :
        ?>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <?php
                while ($past_posts->have_posts()) : $past_posts->the_post();
                    echo get_template_part('template-parts/get', 'post');
                endwhile;
                ?>
            </div>
        <?php else : ?>
            <div class="grid grid-cols-1 gap-x-16 gap-y-10">
                <h3>Watch out this space for past events.</h3>
            </div>
        <?php endif; ?>

        <p class="text-center">
            <a href="<?php echo get_site_url(); ?>/events#past-events" class="btn red">SEE ALL PAST EVENTS</a>
        </p>
    </div>
</main>

<?php get_footer() ?>