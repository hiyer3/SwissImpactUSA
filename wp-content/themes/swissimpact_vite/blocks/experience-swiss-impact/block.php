<?php
$categories = get_categories();
?>
<div id="experience-swiss-impact" class="grid grid-cols-2 lg:grid-cols-3 relative w-full md:w-10/12 mx-auto">
    <?php
    for ($i = 0; $i < count($categories); $i++) :

        if ($categories[$i]->slug == "uncategorized") continue;

        if ($i == 4) {
            echo '<div class="category hidden lg:block"></div>';
        }
    ?>
        <div class="category">
            <a class="block" href="<?php echo get_category_link($categories[$i]->term_id); ?>">
                <figure>
                    <img src="<?php echo types_render_termmeta('swiss-impact-section-featured-icon', array('term_id' => $categories[$i]->term_id, 'output' => 'raw')); ?>" class="img  w-full" alt="<?php echo $categories[$i]->name ?>" />
                </figure>
                <figure>
                    <img src="<?php echo types_render_termmeta('swiss-impact-section-featured-icon-hover', array('term_id' => $categories[$i]->term_id, 'output' => 'raw')); ?>" class="img w-full hidden" alt="<?php echo $categories[$i]->name ?>" />
                </figure>
                <div class="cat-title lg:hidden">
                    <?php echo $categories[$i]->name ?>
                </div>
            </a>
        </div>
    <?php endfor; ?>

    <div class="absolute text-xs text-white bottom-2 right-2 attribute">
        Projection by Swiss light artist Gerry Hofstetter
    </div>
</div>