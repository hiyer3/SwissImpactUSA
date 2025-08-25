<div class="swiper-slide flex flex-col">
    <div>
        <?php
        if (has_post_thumbnail()) :
        ?>
            <a class="block" href="<?php echo get_the_permalink(); ?>">
                <div class="h-60 relative bg-cover bg-center overflow-hidden" style="background-image: url('<?php echo get_the_post_thumbnail_url(get_the_ID(), $size = 'post-item'); ?>');">
                    <!--img src="<?php echo get_the_post_thumbnail_url(get_the_ID(), $size = 'post-item'); ?>" class="img left-0 top-0 invisible" /-->
                </div>
            </a>
        <?php endif; ?>
        <div class="w-10/12 mt-4 mb-1">
            <h3><a href="<?php echo get_the_permalink(); ?>"><?php echo get_the_title(); ?></a></h3>
        </div>
    </div>

    <div class="flex flex-column md:flex-row w-11/12 border-t-2 mt-auto pt-3 border-black">
        <div class="w-full md:w-1/3 flex items-center">
            <a href="<?php echo get_the_permalink(); ?>" class="text-xs">LEARN MORE <span class="">&gt;</span></a>
        </div>
        <div class="tags w-full md:w-3/4 flex place-content-end gap-2">
            <?php
            $post_categories = get_the_category();

            if (!empty($post_categories)) {
                foreach ($post_categories as $single_post_category) {
            ?>
                    <a class="single-category relative z-50" href="<?php echo get_site_url() . "/category/" . $single_post_category->slug; ?>">
                        <figure>
                            <img alt="<?php echo $single_post_category->name; ?>" src="<?php echo get_term_meta($single_post_category->cat_ID, "wpcf-taxonomy-icon")[0]; ?>" class="img" />
                        </figure>
                        <span class="label -z-1 transition-all font-medium duration-300 -right-[5%] lg:-right-[250%] absolute top-[102%] leading-[1.15] h-auto w-36 text-center text-xs opacity-0 bg-black px-2 py-1 text-white">
                            <?php echo $single_post_category->name; ?>
                        </span>
                    </a>

            <?php
                }
            }
            ?>
        </div>
    </div>
</div>