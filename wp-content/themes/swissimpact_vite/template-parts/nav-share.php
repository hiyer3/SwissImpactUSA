<div class="w-fit social flex absolute right-5 lg:left-5 h-full <?php echo is_single() ? "top-10 lg:top-28" : "top-0" ?>">
    <div class="flex flex-row lg:flex-col items-center gap-3 relative <?php echo is_single() ? "mt-0 lg:mt-28" : "mt-auto"; ?> mb-4 lg:my-auto transition transition-all duration-200">
        <?php

        $permalink;

        if (is_home()) {
            $permalink = get_site_url();
        } else if (is_category()) {
            $category = get_category(get_query_var('cat'));
            $category_id = $category->cat_ID;
            $permalink = get_category_link($category_id);
        } else if (is_tag()) {
            $tag = get_queried_object();
            $permalink = get_tag_link($tag);
        } else if (is_search()) {
            $permalink = get_site_url() . "?s=" . get_query_var('s');
        } else {
            $permalink = get_the_permalink();
        }
        ?>

        <a href="javascript:void(0);" class="nav-share-icon w-11">
            <picture>
                <?php $share_icon = is_single() ? get_template_directory_uri() . "/assets/img/home/footer-social-share-red-2x.png" : get_template_directory_uri() . "/assets/img/home/footer-social-share-2x.png" ?>
                <img src="<?php echo $share_icon; ?>" class="img w-11" />
            </picture>
        </a>

        <div class="flex flex-row lg:flex-col items-center gap-3 overflow-hidden share-icon-wrapper">
            <a class="w-11" href="javascript:window.open('https://www.facebook.com/sharer/sharer.php?u=<?php echo $permalink; ?>', 'Share on Facebook', 'width=500, height=300')">
                <picture>
                    <?php $fb_icon = is_single() ? get_template_directory_uri() . "/assets/img/home/social-red-fb-2x.webp" : get_template_directory_uri() . "/assets/img/home/hero-social-icon-fb-2x.png" ?>
                    <?php $fb_icon_default = is_single() ? get_template_directory_uri() . "/assets/img/home/social-red-fb-2x.png" : get_template_directory_uri() . "/assets/img/home/hero-social-icon-fb-2x.png" ?>
                    <source srcset="<?php echo $fb_icon; ?>" type="image/webp" />
                    <img src="<?php echo $fb_icon_default; ?>" class="img w-11" />
                </picture>
            </a>

            <a class="w-11" href="https://twitter.com/intent/tweet?url=<?php echo $permalink; ?>&text=<?php echo (is_home() ? urlencode(get_bloginfo('name') . " | " . get_bloginfo('description')) : (is_category() || is_tag() ? single_term_title() : get_the_title())); ?>" target="_blank">
                <picture>
                    <?php $tw_icon = is_single() ? get_template_directory_uri() . "/assets/img/home/social-red-tw-2x.webp" : get_template_directory_uri() . "/assets/img/home/footer-social-tw-2x.webp" ?>
                    <?php $tw_icon_default = is_single() ? get_template_directory_uri() . "/assets/img/home/social-red-tw-2x.png" : get_template_directory_uri() . "/assets/img/home/footer-social-tw-2x.png" ?>
                    <source srcset="<?php echo $tw_icon; ?>" type="image/webp" />
                    <img src="<?php echo $tw_icon_default; ?>" class="img w-11" />
                </picture>
            </a>

            <a class="w-11" href="javascript:window.open('http://www.linkedin.com/shareArticle?mini=true&url=<?php echo $permalink; ?>&title=<?php echo (is_home() ? urlencode(get_bloginfo('name') . " | " . get_bloginfo('description')) : (is_category() || is_tag() ? single_term_title() : get_the_title())); ?>', 'Share on Linkedin', 'width=500, height=300')">
                <picture>
                    <?php $in_icon = is_single() ? get_template_directory_uri() . "/assets/img/home/social-red-li-2x.webp" : get_template_directory_uri() . "/assets/img/home/social-white-in-2x.webp" ?>
                    <?php $in_icon_default = is_single() ? get_template_directory_uri() . "/assets/img/home/social-red-li-2x.png" : get_template_directory_uri() . "/assets/img/home/social-white-in-2x.png" ?>
                    <source srcset="<?php echo $in_icon; ?>" type="image/webp" />
                    <img src="<?php echo $in_icon_default; ?>" class="img w-11" />
                </picture>
            </a>
        </div>

    </div>
</div>