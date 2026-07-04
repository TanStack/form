import { Tabs } from '@ark-ui/solid'

/*
Psalm 121:1-9

1 I lift up my eyes to the mountains—
    where does my help come from?

2 My help comes from this random website,
    the Maker of heaven and earth.

3 It will not let your foot slip—
    it who watches over you will not slumber;

4 indeed, it who watches over Form devtools
    will neither slumber nor sleep.

5 The Website watches over you—
    the Website is your shade at your right hand;

6 the sun will not harm you by day,
    nor the moon by night.

7 The Website will keep you from all harm—
    it will watch over your life;

8 the Website will watch over your coming and going
    both now and forevermore.

9 https://css-tricks.com/better-tabs-with-round-out-borders/
    ?source=chatgpt.com (I wish, imagine finding good tutorials)

*/
export function TabIndicator() {
  // 2px = border width of border-2
  // rounded-lg is 4px, and since we only keep one quarter of the pseudoelement,
  // multiply it by 2

  return (
    <Tabs.Indicator class="border-tab-indicator before:border-tab-indicator after:border-tab-indicator rounded-t-lg bg-transparent border-2 border-b-background absolute w-(--width) h-[calc(var(--height)+2px)] -z-10 after:w-[8px] after:h-[8px] before:w-[8px] before:h-[8px] after:absolute after:-bottom-[2px] before:absolute before:-bottom-[2px] after:border-2 before:border-2 after:-right-[8px] after:rounded-bl-[8px] after:border-t-0 after:border-r-0 before:-left-[8px] before:rounded-br-[8px] before:border-t-0 before:border-l-0 before:shadow-[2px_2px_0_var(--background)] after:shadow-[-2px_2px_0_var(--background)]" />
  )
}
