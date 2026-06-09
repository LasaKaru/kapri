Delivery availability card — render after checking whether Kapruka delivers to a city on a date.

```jsx
<DeliveryStatus city="Colombo" date="Sat, 14 Jun 2026" available rate={350}
  perishableWarning="Cakes are made fresh — please ensure someone can receive it." />
<DeliveryStatus city="Jaffna" date="Sun, 15 Jun 2026" available={false}
  reason="No same-day slots." nextAvailableDate="Mon, 16 Jun 2026" />
```

Green 2px frame + soft header when available (shows the **flat per-order** fee), red when not (shows reason + next date). The perishable warning is **amber/advisory**, not an error — delivery is still possible.
