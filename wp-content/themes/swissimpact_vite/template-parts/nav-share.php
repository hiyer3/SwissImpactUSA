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

        <div class="flex flex-row lg:flex-col items-center gap-3 share-icon-wrapper">
            <a class="group w-11 h-11 flex items-center justify-center rounded-full border-2 border-white hover:shadow-[inset_0_0_0_2px_white] transition-all duration-200" href="javascript:window.open('https://www.facebook.com/sharer/sharer.php?u=<?php echo $permalink; ?>', 'Share on Facebook', 'width=500, height=300')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 transition-transform duration-200 group-hover:scale-90">
                    <path fill="white" d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
                </svg>
            </a>

            <a class="group w-11 h-11 flex items-center justify-center rounded-full border-2 border-white hover:shadow-[inset_0_0_0_2px_white] transition-all duration-200" href="https://x.com/intent/tweet?url=<?php echo $permalink; ?>&text=<?php echo (is_home() ? urlencode(get_bloginfo('name') . " | " . get_bloginfo('description')) : (is_category() || is_tag() ? single_term_title() : get_the_title())); ?>" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 transition-transform duration-200 group-hover:scale-90">
                    <path fill="white" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
            </a>

            <a class="group w-11 h-11 flex items-center justify-center rounded-full border-2 border-white hover:shadow-[inset_0_0_0_2px_white] transition-all duration-200" href="javascript:window.open('http://www.linkedin.com/shareArticle?mini=true&url=<?php echo $permalink; ?>&title=<?php echo (is_home() ? urlencode(get_bloginfo('name') . " | " . get_bloginfo('description')) : (is_category() || is_tag() ? single_term_title() : get_the_title())); ?>', 'Share on Linkedin', 'width=500, height=300')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 transition-transform duration-200 group-hover:scale-90">
                    <path fill="white" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
            </a>
        </div>

    </div>
</div>