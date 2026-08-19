import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { PlaylistFilter } from "./index";

/**
 * States worth seeing rather than every permutation of props.
 *
 * The ones that matter here are the extremes: no playlists at all, and a
 * playlist name long enough to break the layout — which it did, before the
 * control was constrained.
 */
const meta: Meta<typeof PlaylistFilter> = {
  /*
   * Set explicitly. Derived from the path it would read
   * "PlaylistFilter/playlist-filter", because the folder is PascalCase and the
   * story file is kebab-case. The sidebar should name the component once.
   */
  title: "data-input/PlaylistFilter",
  component: PlaylistFilter,
  args: {
    activeSlug: null,
    onSelect: fn(),
    playlists: [
      { id: "PL1", title: "Tutorials", slug: "tutorials", itemCount: 8 },
      {
        id: "PL2",
        title: "Foxy's Opinion",
        slug: "foxys-opinion",
        itemCount: 12,
      },
      {
        id: "PL3",
        title: "What the heck?!",
        slug: "what-the-heck",
        itemCount: 17,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Filters the video list by playlist. A native select rather than a " +
          "row of pills, so the control stays a fixed size however many " +
          "playlists exist.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaylistFilter>;

export const Default: Story = {};

/** The control reflects the active playlist rather than tracking its own state. */
export const PlaylistSelected: Story = {
  args: { activeSlug: "foxys-opinion" },
};

/**
 * A select sizes itself to its longest option, and this name is wider than a
 * phone. It used to run off the side of the viewport rather than truncating —
 * worth keeping visible, because the fix is one easily-deleted CSS property.
 */
export const LongPlaylistName: Story = {
  args: {
    playlists: [
      {
        id: "PL1",
        title: "Every single core Node-RED Node explained",
        slug: "every-single-core-node-red-node-explained",
        itemCount: 3,
      },
      { id: "PL2", title: "Lab Test", slug: "lab-test", itemCount: 2 },
    ],
  },
};

/**
 * The default option remains, so the control is never empty and the page can
 * still describe what it is showing.
 */
export const NoPlaylists: Story = {
  args: { playlists: [] },
};

/** How it behaves in the width it actually gets on a phone. */
export const Narrow: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "22rem" }}>
        <Story />
      </div>
    ),
  ],
};
