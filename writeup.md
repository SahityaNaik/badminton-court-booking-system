# System Internals Write-up

## Database Design Strategy

The database schema is designed to be normalized and data-driven, using **PostgreSQL** for relational consistency and **Prisma ORM** for safe, expressive queries.

### Core Resource Modeling

- **Courts:** Courts are modeled with a strict `type` enum (`INDOOR` / `OUTDOOR`). This ensures data consistency and allows the pricing engine to apply indoor-specific premiums without relying on conditional logic scattered across the codebase.

- **Equipment:** Equipment such as rackets and shoes is modeled as an inventory resource with a `totalQuantity` field. This value acts as an upper bound when validating bookings, ensuring the system never allocates more equipment than physically available.

- **Coaches:** Coaches are stored as independent entities with their own hourly rates. Availability is handled through a separate `CoachAvailability` table that captures date and time ranges. This separation allows fine-grained scheduling and prevents double-booking while keeping the coach model simple.

### The Booking Entity

The `Booking` model acts as the central aggregation point for the system. Each booking references:

1. The user who created it  
2. The reserved court  
3. Optional add-ons such as a coach  
4. Equipment rentals via a join table (`BookingEquipment`)  

This structure enables atomic bookings. All availability checks and inserts are executed inside a single database transaction, ensuring that either all requested resources (court, equipment, coach) are reserved together or the booking fails entirely. This avoids partial state issues, such as reserving a court without securing the required equipment.

Role-based access is enforced at the API level. Public endpoints expose only active resources for booking, while admin-only endpoints provide full visibility and control over courts, equipment, coaches, and availability.

## Pricing Engine Architecture

Pricing logic is implemented as a separate service rather than being embedded inside booking controllers. This separation keeps the booking flow focused on validation and persistence, while pricing remains independently testable and easier to evolve.

### Base Cost Calculation

The engine begins by calculating the base court cost using the court’s hourly price multiplied by the booking duration.

### Dynamic Rule Application

Pricing adjustments are driven by records stored in the `PricingRule` table. For each booking, the engine evaluates applicable rules based on the booking context:

- **Time-based rules**, such as peak hours (e.g., 6–9 PM)  
- **Date-based rules**, such as weekends  
- **Attribute-based rules**, such as indoor court premiums  

Each matching rule contributes a multiplier, allowing multiple rules to stack naturally (e.g., indoor + peak hour + weekend).

### Add-on Costs and Final Total

After the court price is finalized, add-on costs are calculated independently:

- Coach fees are computed using the coach’s hourly rate and booking duration  
- Equipment fees are calculated per item, factoring in quantity and duration  

These components are then combined to produce the final booking price. This modular structure ensures future pricing changes can be introduced without impacting the core booking logic.

While database transactions protect against partial bookings, additional locking strategies could be introduced if the system needed to handle very high levels of concurrent booking traffic.
