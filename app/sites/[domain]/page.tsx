import { notFound } from "next/navigation";
import { getBusinessBySubdomain, incrementPageView } from "@/lib/tenant";
import {
  Card,
  Chip,
  Link as HeroLink,
  Typography,
  buttonVariants,
} from "@heroui/react";
import { BusinessType } from "@/lib/generated/prisma/enums";
import { GallerySection } from "./gallery-section";
import { ReviewsSection } from "./reviews-section";
import { BookingSection } from "./booking-section";
import { MessageSection } from "./message-section";
import { OrderSection } from "./order-section";

type Props = {
  params: Promise<{ domain: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { domain } = await params;
  const business = await getBusinessBySubdomain(domain);
  return { title: business ? business.name : "Site not found" };
}

export default async function TenantHomePage({ params }: Props) {
  const { domain } = await params;
  const business = await getBusinessBySubdomain(domain);

  if (!business) {
    notFound();
  }

  await incrementPageView(business.id);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            {business.name}
          </span>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {business.aboutText && <HeroLink href="#about">About</HeroLink>}
            {business.businessType === BusinessType.SERVICE &&
              business.photos.length > 0 && (
                <HeroLink href="#gallery">Gallery</HeroLink>
              )}
            {business.businessType === BusinessType.SERVICE && (
              <HeroLink href="#booking">Book now</HeroLink>
            )}
            {business.businessType === BusinessType.PRODUCT &&
              business.products.length > 0 && (
                <HeroLink href="#products">Products</HeroLink>
              )}
            {business.businessType === BusinessType.PRODUCT && (
              <HeroLink href="#order">Order now</HeroLink>
            )}
            <HeroLink href="#reviews">Reviews</HeroLink>
            <HeroLink href="#message">Message us</HeroLink>
          </nav>
          <a href="#contact" className={buttonVariants({ size: "sm" })}>
            Get in touch
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative flex min-h-[60vh] flex-col items-center justify-center gap-6 overflow-hidden bg-zinc-900 px-6 py-24 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
          {business.address && (
            <Chip className="relative">{business.address}</Chip>
          )}
          <Typography.Heading
            level={1}
            className="relative max-w-2xl text-4xl text-white sm:text-6xl"
          >
            {business.tagline ?? business.name}
          </Typography.Heading>
          <div className="relative flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
            >
              Get in touch
            </a>
            {business.businessType === BusinessType.SERVICE && (
              <a
                href="#booking"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Book now
              </a>
            )}
            {business.businessType === BusinessType.PRODUCT &&
              business.products.length > 0 && (
                <a
                  href="#products"
                  className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  View products
                </a>
              )}
            {business.businessType === BusinessType.PRODUCT && (
              <a
                href="#order"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Request an order
              </a>
            )}
          </div>
        </section>

        {/* About */}
        {business.aboutText && (
          <section id="about" className="py-20">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 text-center">
              <Typography.Heading level={2} className="text-3xl">
                About
              </Typography.Heading>
              <Typography.Paragraph className="text-muted">
                {business.aboutText}
              </Typography.Paragraph>
            </div>
          </section>
        )}

        {/* Gallery */}
        {business.businessType === BusinessType.SERVICE && (
          <GallerySection photos={business.photos} businessName={business.name} />
        )}

        {/* Booking */}
        {business.businessType === BusinessType.SERVICE && (
          <BookingSection businessId={business.id} subdomain={business.subdomain} />
        )}

        {/* Products */}
        {business.businessType === BusinessType.PRODUCT && business.products.length > 0 && (
          <section
            id="products"
            className="border-t border-border bg-surface-secondary py-20"
          >
            <div className="mx-auto w-full max-w-6xl px-6">
              <Typography.Heading level={2} className="text-center text-3xl">
                Products
              </Typography.Heading>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {business.products.map((product) => (
                  <Card key={product.id}>
                    {product.imageUrl ? (
                      <div className="aspect-4/3 overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-4/3 items-center justify-center rounded-xl bg-linear-to-br from-zinc-700 to-zinc-900 text-xs text-zinc-300">
                        {product.title}
                      </div>
                    )}
                    <Card.Header>
                      <Card.Title>{product.title}</Card.Title>
                      {product.description && (
                        <Card.Description>
                          {product.description}
                        </Card.Description>
                      )}
                    </Card.Header>
                    {product.price != null && (
                      <Card.Footer>
                        <Typography.Heading level={3} className="text-2xl">
                          ${Number(product.price).toLocaleString()}
                        </Typography.Heading>
                      </Card.Footer>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Order */}
        {business.businessType === BusinessType.PRODUCT && (
          <OrderSection
            businessId={business.id}
            subdomain={business.subdomain}
            products={business.products}
          />
        )}

        {/* Reviews */}
        <ReviewsSection
          businessId={business.id}
          subdomain={business.subdomain}
          reviews={business.reviews}
        />

        {/* Message */}
        <MessageSection
          businessId={business.id}
          subdomain={business.subdomain}
          businessName={business.name}
        />

        {/* Contact */}
        <section
          id="contact"
          className="border-t border-border py-24 text-center"
        >
          <Typography.Heading level={2} className="text-3xl">
            Get in touch
          </Typography.Heading>
          {(business.contactEmail || business.contactPhone) && (
            <Typography.Paragraph className="mt-3 text-muted">
              {[business.contactEmail, business.contactPhone]
                .filter(Boolean)
                .join(" · ")}
            </Typography.Paragraph>
          )}
          {business.contactEmail && (
            <a
              href={`mailto:${business.contactEmail}`}
              className={buttonVariants({ className: "mt-6" })}
            >
              Email us
            </a>
          )}
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          {business.address && <span>{business.address}</span>}
        </div>
      </footer>
    </div>
  );
}
