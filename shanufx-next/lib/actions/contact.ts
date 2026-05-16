'use server';

import { adminDb } from '../firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

interface ContactResult {
  status: 'ok' | 'err';
}

export async function sendContactMessage(
  _prevState: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) return { status: 'err' };

  try {
    await adminDb.collection('contactMessages').add({
      name,
      email,
      message,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Fire-and-forget Discord webhook
    const settingsDoc = await adminDb.doc('siteSettings/notifications').get();
    const webhook = settingsDoc.data()?.discordWebhook;
    if (webhook) {
      fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `📬 New message from **${name}** (${email}):\n${message}`,
        }),
      }).catch(() => {});
    }

    return { status: 'ok' };
  } catch {
    return { status: 'err' };
  }
}
