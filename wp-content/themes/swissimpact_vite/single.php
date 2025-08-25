<?php get_header() ?>

<?php
if (have_posts()) : the_post();
?>

    <section>
        <div class="w-11/12 lg:w-10/12 mx-auto">
            <div class="flex flex-column md:flex-row border-t-2 border-black pt-5">
                <div class="w-full md:w-3/4 flex flex-col items-start">
                    <p class="text-swissred text-base font-black ml-2"><?php echo types_render_field('event-from-date'); ?></p>
                </div>
                <div class="tags w-full md:w-1/3 flex place-content-end gap-2">
                    <?php
                    $primary_term_id = yoast_get_primary_term_id();
                    $post_categories = get_the_category();
                    $primary_category;

                    if ($primary_term_id) {
                        $primary_category = get_category($primary_term_id);
                        if ($primary_category) :
                            if (count($post_categories) > 1) :
                    ?>
                                <a class="single-category relative z-50 -mt-1" href="<?php echo get_site_url() . "/category/" . $primary_category->slug; ?>">
                                    <div class="relative w-8 h-8 rounded-full border-swissred border flex justify-center items-center">
                                        <figure>
                                            <img alt="<?php echo $primary_category->name; ?>" src="<?php echo get_term_meta($primary_category->cat_ID, "wpcf-taxonomy-icon")[0]; ?>" class="img w-8 p-1" />
                                        </figure>
                                    </div>

                                    <span class="label -z-1 transition-all font-medium duration-300 -right-[5%] lg:-right-[250%] absolute bottom-2 w-36 text-center text-xs opacity-0 bg-black px-2 py-1 text-white">
                                        <?php echo $primary_category->name; ?>
                                    </span>
                                </a>
                            <?php
                            else :
                            ?>
                                <a class="single-category relative z-50" href="<?php echo get_site_url() . "/category/" . $primary_category->slug; ?>">
                                    <figure>
                                        <img alt="<?php echo $primary_category->name; ?>" src="<?php echo get_term_meta($primary_category->cat_ID, "wpcf-taxonomy-icon")[0]; ?>" class="img w-6" />
                                    </figure>
                                    <span class="label -z-1 transition-all font-medium duration-300 -right-[5%] lg:-right-[250%] absolute bottom-2 w-36 text-center text-xs opacity-0 bg-black px-2 py-1 text-white">
                                        <?php echo $primary_category->name; ?>
                                    </span>
                                </a>

                            <?php
                            endif;
                        endif;
                    }

                    if (!empty($post_categories)) {
                        foreach ($post_categories as $single_post_category) {
                            if ($primary_category) {
                                if ($single_post_category->cat_ID == $primary_term_id) {
                                    continue;
                                }
                            }
                            ?>
                            <a class="single-category relative z-50" href="<?php echo get_site_url() . "/category/" . $single_post_category->slug; ?>">
                                <figure>
                                    <img alt="<?php echo $single_post_category->name; ?>" src="<?php echo get_term_meta($single_post_category->cat_ID, "wpcf-taxonomy-icon")[0]; ?>" class="img w-6" />
                                </figure>
                                <span class="label -z-1 transition-all font-medium duration-300 -right-[5%] lg:-right-[250%] absolute bottom-2 w-36 text-center text-xs opacity-0 bg-black px-2 py-1 text-white">
                                    <?php echo $single_post_category->name; ?>
                                </span>
                            </a>

                    <?php
                        }
                    }
                    ?>
                </div>
            </div>
            <div class="-mt-2 pb-2">
            <?php echo get_template_part('template-parts/get', 'tags'); ?>
            </div>
            <h1 class="md:w-5/6 lg:w-full"><?php echo get_the_title(); ?></h1>
        </div>
    </section>

    <section class="bg-pos-strips bg-no-repeat bg-size-strips" style="background-image: url(<?php echo get_template_directory_uri(); ?>/assets/img/backpages/stripes.png);">
        <div class="w-11/12 post-content lg:w-10/12 mx-auto pb-10 clearfix text-justify">
            <?php
            if (has_post_thumbnail()) :
            ?>
                <figure class="img w-full md:w-1/2 md:float-right pb-4 md:pl-4">
                    <img src="<?php echo get_the_post_thumbnail_url(get_the_ID(), $size = 'full'); ?>" alt="<?php echo get_the_title(); ?>" />
                    <?php if (get_the_post_thumbnail_caption()) : ?>
                        <figcaption class="pt-3 text-center text-sm font-medium italic text-swissred"><?php echo get_the_post_thumbnail_caption() ?></figcaption>
                    <?php endif; ?>
                </figure>
            <?php
            endif;
            ?>
            <?php the_content(); ?>
            <div class=" float-none"></div>
        </div>

        <?php echo get_template_part('template-parts/post', 'recommendations'); ?>
    </section>
<?php else : ?>
    <h1>
        Post not found. Click here to go to <a href="<?php echo get_site_url(); ?>">homepage</a>.
    </h1>
<?php endif; ?>

<?php get_footer() ?>