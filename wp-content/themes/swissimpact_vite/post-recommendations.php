<div class="w-10/12 mx-auto pb-16">
    <div class="title flex mb-6">
        <?php if (is_page()) : ?><h1 class="inline-block">Recent posts</h1><?php endif; ?>
        <?php if (is_single()) : ?><h1 class="inline-block">Recommended for you</h1><?php endif; ?>
    </div>

    <?php
    $primary_category = false;
    $term_list = wp_get_post_terms($post->ID, 'category', ['fields' => 'all']);
    foreach ($term_list as $term) {
        if (get_post_meta($post->ID, '_yoast_wpseo_primary_category', true) == $term->term_id) {
            $primary_category = $term->slug;
        }
    }

    $args = array(
        'post_type' => 'post',
        'posts_per_page' => 3,
        'post__not_in' => array(get_the_ID()),
        'meta_key' => 'wpcf-event-from-date',
        'orderby' => 'meta_value_num',
        'order' => 'DESC',
    );

    if ($primary_category) {
        $args['meta_query'] = array(
            array(
                'key' => '_yoast_wpseo_primary_category',
                'value' => $primary_category,
                'compare' => '=',
            )
        );
    } else {
        $args['category_name'] = $term_list[0]->slug;
    }

    $recommended_posts = new WP_Query($args);

    if ($recommended_posts->have_posts()){
        unset($args['meta_query']);
        $args['category_name'] = $primary_category;
        var_dump($args['category_name'] = $primary_category);
        $recommended_posts = new WP_Query($args);
    }
    ?>

    <?php
    if ($recommended_posts->have_posts()) :
    ?>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-16 gap-y-10">
            <?php
            while ($recommended_posts->have_posts()) : $recommended_posts->the_post();
                echo get_template_part('template-parts/get', 'post');
            endwhile;
            ?>
        </div>
    <?php
    else :
    ?>
        <div class="grid grid-cols-1 gap-x-16 gap-y-10">
            <h3>Watch out this space for Recommended Events.</h3>
        </div>
    <?php
    endif;
    ?>
</div>