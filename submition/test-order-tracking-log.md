# Test order tracking — live MCP log

Captured by calling `kapruka_track_order` on the Kapruka MCP with Kapruka's
official test order number, per their "test order for building/demoing the
after-sale experience" announcement.

- **Tool:** `kapruka_track_order`
- **Order number:** `VPAY827982BA`
- **Captured:** 2026-07-01 (UTC)
- **Result:** Consistent across repeated calls — this is a standing test
  fixture on Kapruka's side, not a live/changing order, so it's safe to use
  as a permanent demo number.

## Request

```json
{ "name": "kapruka_track_order",
  "arguments": { "params": { "order_number": "VPAY827982BA", "response_format": "json" } } }
```

## Response — `json`

```json
{
  "order_number": "VPAY827982BA",
  "pnref": "3005082",
  "status": "delivered",
  "status_display": "Delivered",
  "order_date": "Tue Jun 23 07:10:46 EDT 2026",
  "delivery_date": "24 / JUNE / 2026",
  "shipped_date": "24 Jun 2026 05:11:27 GMT",
  "amount": { "value": "26060", "currency": "LKR" },
  "payment_method": "3645",
  "comments": "Delivery successfully completed.",
  "recipient": {
    "name": "MS. GAYATHRI FERNANDO",
    "phone": "077-3517248<BR",
    "address": "NO. 10/11- HALPITA- POLGASOWITA LT-HOUSE OR RESIDENCE-",
    "city": "POLGASOWITA"
  },
  "greeting_message": "GET WELL SOON GAYATHRI  (FROM KAPRUKA FAMILY)",
  "special_instructions": "",
  "progress": [
    { "step": "Order Confirmed and Awaiting preparation", "timestamp": "JUN 23, 2026 4:40 PM" },
    { "step": "Kapruka Flower Shop, Flower Arrangement is preparing", "timestamp": "JUN 23, 2026 5:15 PM" },
    { "step": "Kapruka Warehouse, Order is preparing", "timestamp": "JUN 23, 2026 5:23 PM" },
    { "step": "Kapruka Warehouse, Order Prepared", "timestamp": "JUN 23, 2026 5:23 PM" },
    { "step": "Other Items received to Kapruka Logistics Facility", "timestamp": "JUN 23, 2026 5:23 PM" },
    { "step": "Order Received", "timestamp": "Jun 23, 2026 05:40 PM" },
    { "step": "Flower Arrangement Has been received to Kapruka Logistics Facility", "timestamp": "JUN 23, 2026 7:37 PM" },
    { "step": "Kapruka Flower Shop, Flower Arrangement prepared", "timestamp": "JUN 24, 2026 8:11 AM" },
    { "step": "Order has been out for delivery", "timestamp": "JUN 24, 2026 8:23 AM" },
    { "step": "Order Has been received by our delivery agent", "timestamp": "JUN 24, 2026 8:24 AM" },
    { "step": "Order has been delivered", "timestamp": "JUN 24, 2026 10:41 AM" }
  ],
  "live_tracking_available": true,
  "has_delivery_video": false,
  "has_delivery_photo": false,
  "items": []
}
```

## Response — `markdown`

```markdown
## Order `VPAY827982BA` — Delivered

| | |
|---|---|
| Total | {'value': '26060', 'currency': 'LKR'} |
| Payment | 3645 |
| Ordered | Tue Jun 23 07:10:46 EDT 2026 |
| Shipped | 24 Jun 2026 05:11:27 GMT |
| Delivery date | 24 / JUNE / 2026 |

**Delivering to**
- MS. GAYATHRI FERNANDO
- NO. 10/11- HALPITA- POLGASOWITA LT-HOUSE OR RESIDENCE-, POLGASOWITA
- 077-3517248<BR

**Greeting:** GET WELL SOON GAYATHRI  (FROM KAPRUKA FAMILY)
**Notes:** Delivery successfully completed.

**Progress**
- JUN 23, 2026 4:40 PM — Order Confirmed and Awaiting preparation
- JUN 23, 2026 5:15 PM — Kapruka Flower Shop, Flower Arrangement is preparing
- JUN 23, 2026 5:23 PM — Kapruka Warehouse, Order is preparing
- JUN 23, 2026 5:23 PM — Kapruka Warehouse, Order Prepared
- JUN 23, 2026 5:23 PM — Other Items received to Kapruka Logistics Facility
- Jun 23, 2026 05:40 PM — Order Received
- JUN 23, 2026 7:37 PM — Flower Arrangement Has been received to Kapruka Logistics Facility
- JUN 24, 2026 8:11 AM — Kapruka Flower Shop, Flower Arrangement prepared
- JUN 24, 2026 8:23 AM — Order has been out for delivery
- JUN 24, 2026 8:24 AM — Order Has been received by our delivery agent
- JUN 24, 2026 10:41 AM — Order has been delivered

_live tracking available on the Kapruka order page._
```

## Notes / gotchas seen in this response

- `order_number` prefix is **`VPAY`**, not `VIMP` — confirms tracking numbers
  aren't all `VIMP…`. This is what motivated generalizing the order-number
  matcher in `src/lib/order-number.ts` (see this branch's other changes).
- `amount` is a nested `{value, currency}` object, not a flat number.
- `recipient.phone` has a trailing `<BR` artifact from Kapruka's backend —
  the app doesn't currently strip it before display.
- `items` is `[]` — as documented in `mcp.md` §7, the tracker card falls
  back to placeholder item data when this happens.
