import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

class PrismaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrismaError';
  }
}


export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || '',
      webhookSecret
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Webhook signature verification failed. ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('Unknown error occurred during webhook verification.');
    return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(`Stripe error: ${e.message} | EVENT TYPE: ${event.type}`);
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error('Unknown error occurred during event handling.');
    return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
  }

  return NextResponse.json({});
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.clerkUserId;

  console.log('Handling checkout.session.completed for user:', userId);

  if (!userId) {
    console.error('No userId found in session metadata.');
    return;
  }

  const subscriptionId = session.subscription as string;

  if (!subscriptionId) {
    console.error('No subscription ID found in session.');
    return;
  }

  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        stripeSubscriptionId: subscriptionId,
        subscriptionActive: true,
        subscriptionTier: session.metadata?.planType || null,
      },
    });
    console.log(`Subscription activated for user: ${userId}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Prisma Update Error:', error.message);
      throw new PrismaError(error.message);
    }
    console.error('Unknown error occurred during Prisma update.');
    throw new PrismaError('Unknown error');
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subId = invoice.subscription as string;

  if (!subId) {
    return;
  }

  let userId: string | undefined;

  try {
    const profile = await prisma.profile.findUnique({
      where: { stripeSubscriptionId: subId },
      select: { userId: true },
    });
    if (!profile?.userId) {
      console.log('No profile found');
      return;
    }
    userId = profile.userId;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Prisma Query Error:', error.message);
      throw new PrismaError(error.message);
    }
    console.error('Unknown error occurred during Prisma query.');
    throw new PrismaError('Unknown error');
  }

  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        stripeSubscriptionId: null,
        subscriptionActive: false,
        subscriptionTier: null,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Prisma Update Error:', error.message);
      throw new PrismaError(error.message);
    }
    console.error('Unknown error occurred during Prisma update.');
    throw new PrismaError('Unknown error');
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  console.log(
    'Handling customer.subscription.deleted for subscription:',
    subscriptionId
  );

  let userId: string | undefined;
  try {
    const profile = await prisma.profile.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });

    if (!profile?.userId) {
      console.error('No profile found for this subscription ID.');
      return;
    }

    userId = profile.userId;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Prisma Query Error:', error.message);
      throw new PrismaError(error.message);
    }
    console.error('Unknown error occurred during Prisma query.');
    throw new PrismaError('Unknown error');
  }

  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        subscriptionActive: false,
        stripeSubscriptionId: null,
        subscriptionTier: null,
      },
    });
    console.log(`Subscription canceled for user: ${userId}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Prisma Update Error:', error.message);
      throw new PrismaError(error.message);
    }
    console.error('Unknown error occurred during Prisma update.');
    throw new PrismaError('Unknown error');
  }
}