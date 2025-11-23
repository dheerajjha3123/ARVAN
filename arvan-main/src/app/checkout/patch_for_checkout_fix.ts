/*
This patch file contains incremental search/replace edits to fix checkout page issues:
- Add console.log in handleSubmit.
- Replace alert with errorMessage state.
- Add error message UI.
- Disable checkout button if cart empty.
*/

// 1. Search inside handleSubmit function for alert usage and replace with errorMessage state update

/*
SEARCH:

const handleSubmit = async () => {
  console.log("Checkout button clicked");
  if (!selectedAddress) {
    alert("Select an address first..");
    return;
  }
  if (!paymentMethod) {
    alert("Select a payment method first..");
    return;
  }
  setIsLoading(true);
  if (paymentMethod === "cod") {
...

REPLACE:

const handleSubmit = async () => {
  console.log("clicked");
  setErrorMessage("");
  if (!selectedAddress) {
    setErrorMessage("Please select an address.");
    return;
  }
  if (!paymentMethod) {
    setErrorMessage("Please select a payment method.");
    return;
  }
  if (!cart || cart.length === 0) {
    setErrorMessage("Your cart is empty.");
    return;
  }
  setIsLoading(true);
  if (paymentMethod === "cod") {
...
*/

// 2. Search render area near <h2 className="text-4xl font-bold mb-4">Delivery To</h2> and insert error message UI block below it

/*
SEARCH:

<h2 className="text-4xl font-bold mb-4">Delivery To</h2>

REPLACE:

<h2 className="text-4xl font-bold mb-4">Delivery To</h2>
{errorMessage && (
  <p className="text-red-500 mb-4 font-semibold">{errorMessage}</p>
)}
*/

// 3. Search the checkout button element start and replace to add disabled and cursor styles

/*
SEARCH:

<button
  onClick={() => handleSubmit()}
  className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 px-4 w-full bg-[#c2e53a] text-black text-xl font-montserrat rounded-lg py-3 font-semibold mt-6 uppercase cursor-pointer hover:bg-[#aecc34]"
>

REPLACE:

<button
  onClick={() => handleSubmit()}
  disabled={!cart || cart.length === 0}
  style={{ cursor: !cart || cart.length === 0 ? "not-allowed" : "pointer" }}
  className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 px-4 w-full bg-[#c2e53a] text-black text-xl font-montserrat rounded-lg py-3 font-semibold mt-6 uppercase cursor-pointer hover:bg-[#aecc34]"
>
*/
