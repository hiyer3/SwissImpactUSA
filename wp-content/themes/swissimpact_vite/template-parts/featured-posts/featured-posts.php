<?php
$args = wp_parse_args($args);

// if is category 
if (is_category()) {
    $category = get_category(get_query_var('cat'));
}

// if is tag 
if (is_tag()) {
    $tag = get_queried_object();
}

if ($args['slug']) {
    $slug = $args['slug'];
}
?>

<div class="slider-wrapper w-11/12 mx-auto lg:mr-0" id="highlights">
    <div class="title flex">
        <h1 class="inline-block">Featured events</h1>
        <div class="swiper-nav inline-flex gap-7 ml-5">
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        </div>
    </div>

    <?php

    //if category page, filter by category 
    if (is_category()) {
        $slug = strtolower($category->slug);
        $slug = "cat_" . str_replace('-', '_', $slug);
    }

    //if tag page, filter by tag/location 
    if (is_tag()) {
        $slug = strtolower($tag->slug);
        $slug = "tag_" . str_replace('-', '_', $slug);
    }

    $featured_posts = get_field($slug, 'option');
    ?>

    <?php
    if ($featured_posts) :
    ?>
        <div class="slider w-swiper">
            <div class="swiper-wrapper">
                <?php
                foreach ($featured_posts as $post) : setup_postdata($post);
                    echo get_template_part('template-parts/get', 'slider-post');
                endforeach;
                ?>
            </div>
        </div>
    <?php else : ?>
        <div class="grid grid-cols-1 gap-x-16 gap-y-10 upcoming-post-wrapper">
            <h3>Check back soon for featured events.</h3>
        </div>
    <?php endif; ?>
    <?php wp_reset_postdata(); ?>

</div>