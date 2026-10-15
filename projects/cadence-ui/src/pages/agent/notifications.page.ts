import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
  CdsUserChipComponent, CdsNotifBellComponent,
  CdsTabsComponent, CdsTabComponent,
} from '../../public-api';

/** One notification timeline row (PDO `context` + `created_at`/`read_at`). */
interface Notif {
  icon: string;
  title: string;
  subtext: string;
  time: string;
  unread: boolean;
}

/**
 * MOCK page — Agent · Notifications (`/notifications` → NotificationComponent).
 *
 * SOURCE-FIRST port of PDO `notification.component.html`, rendered inside the
 * agent top-nav shell (which the captured reference shows in frame, user
 * "Hugo Calder"). No nav item is active on this route — matches the reference.
 *
 * Structure mirrors notification.component.html 1:1:
 *   notifications-page
 *     ├ notifications-page__header → h3 "Notifications" + "Mark all as read"
 *     └ w-100
 *         ├ nav-tabs view-leads-tabs → "All" / "Unread (N)"  (→ cds-tabs)
 *         └ view-leads-activity > tab-content
 *             └ notifications-page__timeline
 *                 └ timeline-item (repeat)
 *                     ├ timeline-icon [.new]  → icon box + unread dot
 *                     └ timeline-details → detail-title / detail-subtext / detail-time
 *
 * Presentational only (no mark-as-read / infinite-scroll / routing behaviour).
 */
@Component({
  selector: 'cds-page-notifications',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
    CdsUserChipComponent, CdsNotifBellComponent,
    CdsTabsComponent, CdsTabComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item>Dashboard</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <button class="cds-icon-btn" aria-label="Help"><i class="ph-bold ph-question"></i></button>
        <cds-notif-bell [count]="19"></cds-notif-bell>
        <cds-user-chip name="Jude Calder" role="Agent" [src]="placeholder"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <section class="notifications">
        <!-- notifications-page__header : title + Mark all as read -->
        <header class="notifications__header">
          <h3 class="notifications__title">Notifications</h3>
          <div class="notifications__actions">
            <button cds-button variant="secondary-neutral" iconLeft="ph-bold ph-checks">Mark all as read</button>
          </div>
        </header>

        <!-- w-100 : tabs + timeline -->
        <div class="notifications__body">
          <cds-tabs [activeIndex]="0">
            <!-- tab-pane : All -->
            <cds-tab label="All">
              <div class="timeline">
                @for (n of notifications; track $index) {
                  <div class="timeline-item ti-{{ $index }} {{ n.unread ? 'ti-unread' : 'ti-read' }}">
                    <span class="timeline-icon" [class.timeline-icon--new]="n.unread">
                      <i class="{{ n.icon }}" aria-hidden="true"></i>
                    </span>
                    <div class="timeline-details">
                      <p class="detail-title">{{ n.title }}</p>
                      <p class="detail-subtext">{{ n.subtext }}</p>
                      <p class="detail-time">{{ n.time }}</p>
                    </div>
                  </div>
                }
              </div>
            </cds-tab>

            <!-- tab-pane : Unread -->
            <cds-tab label="Unread (19)">
              <div class="timeline">
                @for (n of unread; track $index) {
                  <div class="timeline-item tu-{{ $index }} ti-unread">
                    <span class="timeline-icon timeline-icon--new">
                      <i class="{{ n.icon }}" aria-hidden="true"></i>
                    </span>
                    <div class="timeline-details">
                      <p class="detail-title">{{ n.title }}</p>
                      <p class="detail-subtext">{{ n.subtext }}</p>
                      <p class="detail-time">{{ n.time }}</p>
                    </div>
                  </div>
                }
              </div>
            </cds-tab>
          </cds-tabs>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .notifications { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    .notifications__header { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); }
    .notifications__title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-medium); font-size: 22px; line-height: 22px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .notifications__actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .notifications__body { width: 100%; }

    /* notifications-page__timeline : flat list, items are rows (not cards). */
    .timeline { display: flex; flex-direction: column; align-items: flex-start; }
    .timeline-item { display: flex; align-items: flex-start; gap: var(--cds-space-12); width: 100%; padding: 12px 16px 20px; border-radius: var(--cds-radius-sm); }

    .timeline-icon { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; flex: none; border-radius: 4px; background: var(--cds-neutral-100); color: var(--cds-text-primary); }
    .timeline-icon i { font-size: 16px; }
    .timeline-icon--new::after { content: ''; position: absolute; top: -2px; left: -2px; width: 7px; height: 7px; border-radius: 50%; background: var(--cds-error-500, #d92d20); }

    .timeline-details { display: flex; flex-direction: column; gap: var(--cds-space-4); min-width: 0; }
    .detail-title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-medium); font-size: var(--cds-font-size-md); line-height: 21px; color: var(--cds-text-primary); }
    .detail-subtext { margin: 0; font-family: var(--cds-font-family-regular); font-weight: var(--cds-weight-regular); font-size: 12px; line-height: 18px; color: var(--cds-text-primary); }
    .detail-time { margin: 0; font-size: 12px; line-height: 18px; color: var(--cds-text-tertiary); }
  `],
})
export class NotificationsPage {
  /** Neutral avatar placeholder (data URI so the chip carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  /** `notifList` — the All timeline (11 items, matching the reference capture). */
  notifications: Notif[] = [
    { icon: 'ph ph-envelope-simple', title: 'Site visit tomorrow', subtext: 'Reminder: Visit with Luca Ashby at Emerald Heights Residences, 4:00 PM.', time: '3 months ago', unread: true },
    { icon: 'ph ph-envelope-simple', title: 'Site visit tomorrow', subtext: 'Reminder: Visit with Luca Ashby at Emerald Heights Residences, 4:30 PM.', time: '3 months ago', unread: true },
    { icon: 'ph ph-bell-ringing', title: 'Property Visit Completed for Sasha Ashby', subtext: 'The visit on June 27, 2026 at Emerald Heights Residences is done and the completion report is in. Tap to view the details.', time: '4 months ago', unread: true },
    { icon: 'ph ph-bell-ringing', title: 'Lead ready for endorsement', subtext: 'Luca Ashby has successfully submitted the Client Appointment Slip and is now eligible for endorsement.', time: '4 months ago', unread: true },
    { icon: 'ph ph-bell-ringing', title: 'Property Visit Completed for Gia Barden', subtext: 'The visit on June 18, 2026 at Townscapes Malvar is done and the completion report is in. Tap to view the details.', time: '4 months ago', unread: true },
    { icon: 'ph ph-bell-ringing', title: 'Property Visit Reminder: Gia Barden', subtext: 'A visit is scheduled for June 18, 2026 at 2:00 AM, Townscapes Malvar. Tap to view it in your calendar.', time: '4 months ago', unread: true },
    { icon: 'ph ph-bell-ringing', title: 'Property Visit Completed for Gia Barden', subtext: 'The visit on June 19, 2026 at Townscapes Malvar is done and the completion report is in. Tap to view the details.', time: '4 months ago', unread: true },
    { icon: 'ph ph-bell-ringing', title: 'New lead assigned', subtext: 'Nils Calder was assigned to you. Tap to view the lead profile.', time: '5 months ago', unread: true },
    { icon: 'ph ph-bell-ringing', title: 'Document signed', subtext: 'Sasha Ashby signed the Client Appointment Slip.', time: '5 months ago', unread: true },
    { icon: 'ph ph-bell-ringing', title: 'Payment received', subtext: 'Down payment received for Emerald Heights Residences.', time: '5 months ago', unread: true },
    { icon: 'ph ph-bell-ringing', title: 'Site visit completed', subtext: 'Site visit with Asr Asr marked complete.', time: '6 months ago', unread: true },
  ];

  /** Unread tab — `notifList` filtered to unread items. */
  get unread(): Notif[] { return this.notifications.filter((n) => n.unread); }
}
