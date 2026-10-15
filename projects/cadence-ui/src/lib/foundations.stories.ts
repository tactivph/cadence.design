import type { Meta, StoryObj } from '@storybook/angular';

/** Design-token reference pulled straight from the Cadence theme CSS variables. */
const meta: Meta = {
  title: 'Foundations/Overview',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

const swatch = (label: string, varName: string) => `
  <div style="display:flex;flex-direction:column;gap:6px">
    <div style="height:56px;border-radius:8px;border:1px solid var(--cds-border-subtle);background:var(${varName})"></div>
    <div style="font:500 12px Inter"><div>${label}</div>
      <div style="color:var(--cds-text-tertiary)">${varName}</div></div>
  </div>`;

export const Colors: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px;max-width:900px">
        ${['primary-600','primary-500','primary-700','primary-50',
            'gray-900','gray-700','gray-500','gray-300','gray-100',
            'success-600','warning-500','danger-600','info-600']
          .map(c => swatch(c, '--cds-' + c)).join('')}
      </div>`,
  }),
};

export const Typography: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:800px">
        <div class="cds-h1">Heading H1 — Hyogo/Inter</div>
        <div class="cds-h2">Heading H2</div>
        <div class="cds-h3">Heading H3</div>
        <div class="cds-h4">Heading H4</div>
        <div class="cds-h5">Heading H5</div>
        <div class="cds-h6">Heading H6</div>
        <div class="cds-body-lg">Body large — the quick brown fox jumps over the lazy dog.</div>
        <div class="cds-body-md">Body medium — the quick brown fox jumps over the lazy dog.</div>
        <div class="cds-body-sm">Body small — the quick brown fox jumps over the lazy dog.</div>
        <div class="cds-label-md">Label medium</div>
        <div class="cds-overline">Overline</div>
      </div>`,
  }),
};

export const Spacing: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:10px">
        ${[2,4,8,12,16,24,32,48].map(s => `
          <div style="display:flex;align-items:center;gap:12px">
            <code style="width:64px">space-${s}</code>
            <div style="height:16px;width:var(--cds-space-${s});background:var(--cds-color-primary);border-radius:4px"></div>
          </div>`).join('')}
      </div>`,
  }),
};

export const Radii: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        ${['xs','sm','md','lg','xl','pill'].map(r => `
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center">
            <div style="width:72px;height:72px;background:var(--cds-color-primary-subtle);
                 border:1px solid var(--cds-color-primary);border-radius:var(--cds-radius-${r})"></div>
            <code>${r}</code>
          </div>`).join('')}
      </div>`,
  }),
};

export const Shadows: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:24px;flex-wrap:wrap;padding:12px">
        ${['xs','sm','md','lg','xl'].map(s => `
          <div style="display:flex;flex-direction:column;gap:8px;align-items:center">
            <div style="width:88px;height:88px;background:#fff;border-radius:12px;box-shadow:var(--cds-shadow-${s})"></div>
            <code>shadow-${s}</code>
          </div>`).join('')}
      </div>`,
  }),
};
