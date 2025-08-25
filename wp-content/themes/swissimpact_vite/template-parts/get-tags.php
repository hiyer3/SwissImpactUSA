<div class="flex flex-col flex-wrap gap-1 my-2 md:my-0">
    <?php
    if (has_tag()) {
        foreach (get_the_tags() as $tag) {
    ?>
            <a href="<?php echo get_site_url(); ?>/tag/<?php echo $tag->slug; ?>" class="flex flex-row mr-2 relative">
                <?php if (get_term_meta($tag->term_id, 'wpcf-location-icon')) : ?>
                    <figure>
                        <img class="img <?php echo $tag->slug == 'virtual' ? 'w-4' : 'w-6'; ?> inline-block gap-5" src="<?php echo get_term_meta($tag->term_id, 'wpcf-location-icon')[0]; ?>" alt="<?php echo $tag->name; ?> location map" />
                    </figure>
                    <h5 class="inline-block <?php echo $tag->slug == 'virtual' ? 'text-normal' : 'text-lg'; ?> font-black ml-1"><?php echo strtoupper($tag->name); ?></h5>
                <?php else : ?>
                    <div class="w-4 inline-block gap-5"></div>
                    <h5 class="inline-block <?php echo $tag->slug == 'virtual' ? 'text-normal' : 'text-lg'; ?> font-black ml-2"><?php echo strtoupper($tag->name); ?></h5>
                <?php endif; ?>
            </a>
    <?php
        }
    }
    ?>
</div>