<?php

/**
 * Search Page template 
 **/
?>

<?php echo get_header(); ?>
<div class="w-11/12 lg:w-10/12 mx-auto my-16">
    <div class="title flex mb-6 flex-col lg:flex-row">

        <div class="category-filter w-52 flex items-center my-5 lg:my-0 filter-category"
            data-container=".upcoming-post-wrapper" data-event="upcoming" data-search="true">
            <div class="font-medium relative">
                <div class="filter-header search cursor-pointer flex flex-row border-swissred border py-1 px-2 h-8">
                    <div class="flex self-center flex-col">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/backpages/icon-catagories-2x.png"
                            class="w-5 mr-2" />
                    </div>
                    <div class="text-base">FILTER BY CATEGORY</div>
                </div>

                <div class="filter-dropdown hidden absolute w-full top-8 left-0 border-black border bg-white">
                    <?php
                    $categories = get_categories(array('hide_empty' => false));
                    foreach ($categories as $category) {
                        if ($category->slug != 'uncategorized'):
                            $custom_query_res = $wpdb->get_results("SELECT meta_value from $wpdb->termmeta INNER JOIN $wpdb->terms on " . $wpdb->terms . ".term_id = " . $wpdb->termmeta . ".term_id WHERE " . $wpdb->termmeta . ".term_id = '$category->term_id' AND " . $wpdb->termmeta . ".meta_key = 'wpcf-taxonomy-icon' ");
                            ?>
                            <div class="left-0 p-1 w-full border-b">
                                <div class="flex items-center">
                                    <input type="checkbox" class="mr-1" id="filter-<?php echo $category->slug; ?>"
                                        name="<?php echo $category->term_id; ?>">
                                    <label for="filter-<?php echo $category->slug; ?>">
                                        <figure>
                                            <img src="<?php echo $custom_query_res[0]->meta_value; ?>" class="w-5 mr-2" />
                                        </figure>
                                    </label>
                                    <div class="text-xs"><label for="filter-<?php echo $category->slug; ?>">
                                            <?php echo strtoupper($category->name); ?>
                                        </label></div>
                                </div>
                            </div>
                            <?php
                        endif;
                    }
                    ?>
                    <div>

                    </div>
                </div>
            </div>
        </div>
        <div class="category-filter w-52 flex items-center lg:ml-5 mb-5 lg:mb-0 relative filter-tags"
            data-container=".upcoming-post-wrapper" data-event="upcoming" data-search="true">
            <div class="font-medium relative">
                <div class="filter-header search cursor-pointer flex flex-row border-swissred border py-1 px-2 h-8">
                    <div class="flex self-center flex-col">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/backpages/icon-location-2x.png"
                            class="w-5 mr-2" />
                    </div>
                    <div class="text-base">FILTER BY LOCATION</div>
                </div>

                <div class="filter-dropdown hidden absolute w-full top-8 left-0 border-black border bg-white">
                    <?php
                    $tags = get_tags(array('hide_empty' => false));
                    foreach ($tags as $tag) {
                        if ($tag):
                            $custom_query_res = $wpdb->get_results("SELECT meta_value from $wpdb->termmeta INNER JOIN $wpdb->terms on " . $wpdb->terms . ".term_id = " . $wpdb->termmeta . ".term_id WHERE " . $wpdb->termmeta . ".term_id = '$tag->term_id' AND " . $wpdb->termmeta . ".meta_key = 'wpcf-taxonomy-icon' ");

                            ?>
                            <div class="left-0 p-1 w-full border-b">
                                <div class="flex items-center">
                                    <input data-tag-name="<?php echo $tag->slug ?>" type="checkbox" class="mr-1"
                                        id="filter-<?php echo $tag->slug; ?>" name="<?php echo $tag->term_id; ?>">
                                    <label for="filter-<?php echo $tag->slug; ?>">
                                        <figure>
                                            <img src="<?php echo $tag->meta_value; ?>" class="w-5 mr-2" />
                                        </figure>
                                    </label>
                                    <div class="text-xs"><label for="filter-<?php echo $tag->slug; ?>">
                                            <?php echo strtoupper($tag->name); ?>
                                        </label></div>
                                </div>
                            </div>
                            <?php
                        endif;
                    }
                    ?>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php

    $args = [
        's' => $_GET['s'],
        'paged' => get_query_var('paged') ? get_query_var('paged') : 1,
        'meta_key' => 'wpcf-event-from-date',
        'orderby' => 'meta_value',
        'order' => 'DESC',
        'relevanssi' => true,
    ];

    if (isset($_GET['cat'])) {
        $cat_ids = explode(',', $_GET['cat']);
        $cat_ids = array_map('intval', $cat_ids);
        $args['category__in'] = $cat_ids;
    }

    if (isset($_GET['tags'])) {
        $tag_ids = explode(',', $_GET['tags']);
        $tag_ids = array_map('intval', $tag_ids);
        $args['tag__in'] = $tag_ids;
    }

    $wp_query = new WP_Query($args);

    if ($wp_query->have_posts()):
        ?>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-16 gap-y-10 upcoming-post-wrapper">
            <?php
            while ($wp_query->have_posts()):
                $wp_query->the_post();
                echo get_template_part('template-parts/get', 'post');
            endwhile;
            ?>
        </div>

        <div class="mb-3 mt-12 text-center">
            <?php the_posts_pagination(
                array(
                    'mid_size' => 2,
                    'prev_text' => __('Prev', 'textdomain'),
                    'next_text' => __('Next', 'textdomain'),
                )
            ); ?>
        </div>

    <?php else: ?>
        <div class="grid grid-cols-1 gap-x-16 gap-y-10 upcoming-post-wrapper">
            <h3>No posts found. Please refine your search. </h3>
        </div>
    <?php endif; ?>
</div>
<?php echo get_footer(); ?>