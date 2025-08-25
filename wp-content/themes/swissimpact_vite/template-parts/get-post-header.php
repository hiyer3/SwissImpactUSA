<div class="flex flex-column md:flex-row mt-4">
    <div class="w-full md:w-3/4 flex flex-col items-start">
        <p class="text-swissred text-base font-black ml-2">
            <?php echo types_render_field('event-from-date'); ?>
        </p>
    </div>
    <div class="tags w-full md:w-1/3 flex place-content-end gap-1">
        <?php
        $post_categories = get_the_category();

        if (!empty($post_categories)) {
            foreach ($post_categories as $single_post_category) {
                ?>
                <a class="single-category relative z-5"
                    href="<?php echo get_site_url() . "/category/" . $single_post_category->slug; ?>">
                    <figure>
                        <img alt="<?php echo $single_post_category->name; ?>"
                            src="<?php echo get_term_meta($single_post_category->cat_ID, "wpcf-taxonomy-icon")[0]; ?>"
                            class="img w-6" />
                    </figure>
                    <span
                        class="label -z-1 transition-all font-medium duration-300 -right-[5%] lg:-right-[250%] absolute top-[82%] leading-[1.15] h-auto w-36 text-center text-xs opacity-0 bg-black px-2 py-1 text-white">
                        <?php echo $single_post_category->name; ?>
                    </span>
                </a>

                <?php
            }
        }
        ?>
    </div>
</div>
<div class="mb-4 flex flex-col items-start">
    <?php echo get_template_part('template-parts/get', 'tags'); ?>
</div>