<?php get_header() ?>


<header class="flex pb-8 relative justify-center min-h-half-screen sm:min-h-sm-custom md:min-h-auto pt-16">
    <?php
    echo get_template_part('template-parts/nav', 'menu')
    ?>

    <?php if (!is_404()) : ?>

        <div class="social flex absolute right-5 md:left-5 h-full top-0">
            <div class="flex flex-col items-center gap-3 mb-auto mt-9 md:my-auto">
                <a href="javascript:window.open('https://www.facebook.com/sharer/sharer.php?u=<?php echo is_home() ? get_site_url() : get_permalink(); ?>', 'Share on Facebook', 'width=500, height=300')">
                    <figure>
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/hero-social-icon-fb-2x.png" class="img w-11" />
                    </figure>
                </a>
                <a href="https://twitter.com/intent/tweet?url=<?php echo is_home() ? get_site_url() : get_permalink(); ?>&text=<?php echo (is_home() ? urlencode(get_bloginfo('name') . " | " . get_bloginfo('description')) : (is_category() ? single_term_title() : get_the_title())); ?>" target="_blank">
                    <figure>
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/footer-social-tw-2x.webp" class="img w-11" />
                    </figure>
                </a>
            </div>
        </div>

        <div class="flex flex-col items-center logo-wrapper">
            <div class="logo text-center pt-10 md:pt-5">
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/Swiss-Impact-Logo-KO-RGB@2x.png" class="img hero-logo" alt="Swiss Impact Logo" />
                </figure>
            </div>

            <div class="pt-12 pb-20">
                <a href="#experience-swiss-impact" class="btn transparent">Experience Swiss Impact</a>
            </div>

            <figure class="absolute md:relative bottom-3 md:bottom-0">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/hero-scroll-down-2x.webp" class="img w-16 scroll-down" />
            </figure>
        </div>
    <?php endif; ?>

</header>

<main class="flex-grow mb-8">

    <div class="intro w-11/12 md:w-8/12 mx-auto py-10">
        <h3 class="pb-1">Welcome to SWISS IMPACT!</h3>
        <p class="pt-2">We invite you to discover Switzerland's positive impact across the United States and to learn more about Swiss innovation, sustainability, economic relations, and humanitarianism, as well as its diverse culture. Whether you are an expert on Switzerland or just know about its famous chocolate and cheese, we are excited to tell you more about what we do in the United States and how you can take part in our many events and activities. Explore our great programming below, learn more about the excellent relationship between Switzerland and the United States, and be sure to secure your spot at one of our upcoming public events!</p>
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
                    ?>
                        <div class="swiper-slide">
                            <?php
                            if (has_post_thumbnail()) :
                            ?>
                                <a class="block" href="<?php echo get_the_permalink(); ?>">
                                    <div class="max-h-60 relative bg-cover bg-center overflow-hidden" style="background-image: url('<?php echo get_the_post_thumbnail_url(); ?>');">
                                        <img src="<?php echo get_the_post_thumbnail_url(); ?>" class="img left-0 top-0 invisible" />
                                    </div>
                                </a>
                            <?php endif; ?>
                            <div class="w-10/12 mt-4 mb-1">
                                <h3><a href="<?php echo get_the_permalink(); ?>"><?php echo get_the_title(); ?></a></h3>
                            </div>

                            <div class="flex flex-column md:flex-row w-11/12 border-t-2 pt-3 border-black">
                                <div class="w-full md:w-1/3 flex items-center">
                                    <a href="<?php echo get_the_permalink(); ?>" class="text-xs">LEARN MORE <span class="">&gt;</span></a>
                                </div>
                                <div class="tags w-full md:w-3/4 flex place-content-end gap-2">
                                    <?php
                                    $post_categories = get_the_category();

                                    if (!empty($post_categories)) {
                                        foreach ($post_categories as $single_post_category) {
                                    ?>
                                            <a href="<?php echo get_site_url() . "/category/" . $single_post_category->slug; ?>">
                                                <figure>
                                                    <img alt="<?php echo $single_post_category->name; ?>" src="<?php echo get_term_meta($single_post_category->cat_ID, "wpcf-taxonomy-icon")[0]; ?>" class="img w-6" />
                                                </figure>
                                            </a>

                                    <?php
                                        }
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>
                    <?php endwhile ?>
                </div>
            <?php else : ?>
                <div class="grid grid-cols-1 gap-x-16 gap-y-10">
                    <h3>Watch out this space for upcoming events.</h3>
                </div>
            <?php endif; ?>
            <?php wp_reset_postdata(); ?>

        </div>
    </div>

    <div class="w-11/12 md:w-10/12 mx-auto mt-10 mb-16">
        <p class="pb-3">
            Did you know that Switzerland is the 7th largest Foreign Direct Investor in the United States, that the country has four national languages, and that it is home to the International Committee of the Red Cross as well as the European headquarters of the United Nations? Did you also know that thanks to its innovative spirit, Switzerland has the longest tunnel in the world and is one of the most sustainable countries in the world?
        </p>
        <p>
            Learn more about the positive impact of Switzerland in the various fields by clicking on the icons below.
        </p>
    </div>

    <div id="experience-swiss-impact" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 relative">
        <div class="category">
            <a class="block" href="<?php echo get_site_url(); ?>/category/innovative-impact/">
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-innovation-blue-2x.webp" class="img  w-full" alt="Innovative" />
                </figure>
                <figure>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/img/home/icon-innovation-color-2x.webp" class="img w-full hidden" alt="Innovative" />
                </figure>
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
            </a>
        </div>
        <div class="absolute t  ext-xs text-white bottom-2 right-2">
            Projection by Swiss light artist Gerry Hofstetter
        </div>
    </div>

    <div class="w-11/12 md:w-10/12 mx-auto py-10">
        <h1>Upcoming Events</h1>

        <?php
        $args = array(
            'post_type' => 'post',
            'posts_per_page' => 3,
            'meta_query' => array(
                array(
                    'key' => 'wpcf-event-from-date',
                    'value' => todayUnixDate(),
                    'compare' => '>=',
                    'type' => 'UNSIGNED'
                )
            ),
        );

        $upcoming_posts = new WP_Query($args);
        ?>

        <?php
        if ($upcoming_posts->have_posts()) :
        ?>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <?php
                while ($upcoming_posts->have_posts()) : $upcoming_posts->the_post();
                ?>
                    <div class="border-t-2 py-4 mb-4">
                        <div class="flex flex-column md:flex-row my-4">
                            <div class="w-full md:w-3/4 flex flex-col items-start">
                                <p class="text-swissred text-base font-black ml-2"><?php echo types_render_field('event-from-date'); ?></p>
                                <a href="<?php echo get_site_url() . "/tag/" . get_the_tags()[0]->slug ?>" class="flex flex-row">
                                    <figure>
                                        <img class="img w-6 inline-block gap-5" src="<?php echo get_term_meta(get_the_tags()[0]->term_id, 'wpcf-location-icon')[0]; ?>" alt="WASHINGTON, DC map" />
                                    </figure>
                                    <h5 class="inline-block text-lg xl:text-xl font-black"><?php echo strtoupper(get_the_tags()[0]->name); ?></h5>
                                </a>
                            </div>
                            <div class="tags w-full md:w-1/3 flex place-content-end gap-2">
                                <?php
                                $post_categories = get_the_category();

                                if (!empty($post_categories)) {
                                    foreach ($post_categories as $single_post_category) {
                                ?>
                                        <a href="<?php echo get_site_url() . "/category/" . $single_post_category->slug; ?>">
                                            <figure>
                                                <img alt="<?php echo $single_post_category->name; ?>" src="<?php echo get_term_meta($single_post_category->cat_ID, "wpcf-taxonomy-icon")[0]; ?>" class="img" />
                                            </figure>
                                        </a>

                                <?php
                                    }
                                }
                                ?>
                            </div>
                        </div>

                        <?php
                        if (has_post_thumbnail()) :
                        ?>
                            <a class="block" href="<?php echo get_the_permalink(); ?>">
                                <div class="max-h-60 relative bg-cover bg-center overflow-hidden" style="background-image: url('<?php echo get_the_post_thumbnail_url(); ?>');">
                                    <img src="<?php echo get_the_post_thumbnail_url(); ?>" class="img left-0 top-0 invisible" />
                                </div>
                            </a>
                        <?php endif; ?>
                        <div class="w-10/12 mt-4 mb-3">
                            <a href="<?php echo get_the_permalink(); ?>">
                                <h3><?php echo get_the_title(); ?></h3>
                            </a>
                            <p class="text-sm"><?php echo get_the_excerpt(); ?></p>
                        </div>

                        <div class="flex flex-column md:flex-row">
                            <div class="w-full md:w-1/3 flex items-center">
                                <a href="<?php echo get_the_permalink(); ?>" class="text-xs mt-2 font-black">LEARN MORE <span class="">&gt;</span></a>
                            </div>
                        </div>
                    </div>
                <?php
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
            'meta_query' => array(
                array(
                    'key' => 'wpcf-event-from-date',
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
                ?>
                    <div class="border-t-2 py-4 mb-4">
                        <div class="flex flex-column md:flex-row my-4">
                            <div class="w-full md:w-3/4 flex flex-col items-start">
                                <p class="text-swissred text-base font-black ml-2"><?php echo types_render_field('event-from-date'); ?></p>
                                <a href="<?php echo get_site_url() . "/tag/" . get_the_tags()[0]->slug ?>" class="flex flex-row">
                                    <figure>
                                        <img class="img w-6 inline-block gap-5" src="<?php echo get_term_meta(get_the_tags()[0]->term_id, 'wpcf-location-icon')[0]; ?>" alt="WASHINGTON, DC map" />
                                    </figure>
                                    <h5 class="inline-block text-lg xl:text-xl font-black"><?php echo strtoupper(get_the_tags()[0]->name); ?></h5>
                                </a>
                            </div>
                            <div class="tags w-full md:w-1/3 flex place-content-end gap-2">
                                <?php
                                $post_categories = get_the_category();

                                if (!empty($post_categories)) {
                                    foreach ($post_categories as $single_post_category) {
                                ?>
                                        <a href="<?php echo get_site_url() . "/category/" . $single_post_category->slug; ?>">
                                            <figure>
                                                <img alt="<?php echo $single_post_category->name; ?>" src="<?php echo get_term_meta($single_post_category->cat_ID, "wpcf-taxonomy-icon")[0]; ?>" class="img" />
                                            </figure>
                                        </a>

                                <?php
                                    }
                                }
                                ?>
                            </div>
                        </div>

                        <?php
                        if (has_post_thumbnail()) :
                        ?>
                            <a class="block" href="<?php echo get_the_permalink(); ?>">
                                <div class="max-h-60 relative bg-cover bg-center overflow-hidden" style="background-image: url('<?php echo get_the_post_thumbnail_url(); ?>');">
                                    <img src="<?php echo get_the_post_thumbnail_url(); ?>" class="img left-0 top-0 invisible" />
                                </div>
                            </a>
                        <?php endif; ?>
                        <div class="w-10/12 mt-4 mb-3">
                            <a href="<?php echo get_the_permalink(); ?>">
                                <h3><?php echo get_the_title(); ?></h3>
                            </a>
                            <p class="text-sm"><?php echo get_the_excerpt(); ?></p>
                        </div>

                        <div class="flex flex-column md:flex-row">
                            <div class="w-full md:w-1/3 flex items-center">
                                <a href="<?php echo get_the_permalink(); ?>" class="text-xs mt-2 font-black">LEARN MORE <span class="">&gt;</span></a>
                            </div>
                        </div>
                    </div>
                <?php
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