export default function CreateListing() {
  return (
    <main className="max-w-4xl mx-auto">
      {/*👆 max-w-4xl sets the max width of the element to 56rem (896px).👆 */}
      <h1 className="text-center text-3xl my-7">Create Listing</h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          {/*flex-1 stretches to fill available👆 space and Only works inside a flex container👆 */}
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            // maxLength={62}
            // minLength={10}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
          />

          {/* ======================Sell,Rent,Parking,Furnished,Offer====== */}
          <div className="flex gap-6 flex-wrap">
            {/* flex-rap pushes the other content to the next line if theres not enough space for it on the first line */}
            <div className="flex flex-row gap-3">
              <input
                type="checkbox"
                id="sale"
                className="border rounded-lg p-3"
              />
              <span>Sell</span>
            </div>
            <div className="flex flex-row gap-3">
              <input
                type="checkbox"
                id="rent"
                className="border rounded-lg p-3"
              />
              <span>Rent</span>
            </div>
            <div className="flex flex-row gap-3">
              <input type="checkbox" id="parking" />
              <span>Parking spot</span>
            </div>
            <div className="flex flex-row gap-3">
              <input type="checkbox" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex flex-row gap-3">
              <input type="checkbox" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          {/* ==============Beds,Baths,RegPrice===================== */}
          <div className="flex flex-row flex-wrap gap-6">
            <div className="flex flex-row items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={5}
                required
                className="border border-gray-300 rounded-lg p-3"
              />
              <span>Beds</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <input
                className="border border-gray-300 rounded-lg p-3"
                type="number"
                min={1}
                max={5}
                id="bathrooms"
                required
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border border-gray-300 rounded-lg p-3"
                type="number"
                min={1}
                max={10}
                id="bathrooms"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">{`$/month`}</span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <input
                type="number"
                min={1}
                max={10}
                id="discountPrice"
                required
                className="border border-gray-500 p-3 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">{`$/month`}</span>
              </div>
            </div>
          </div>
        </div>
        {/* ============== Righ Hand Side====================== */}
        <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
                Images:
                <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
            </p>
            <div className="flex flex-row gap-4">
                <input 
                type="file"
                id="images"
                accept="image/*"
                multiple 
                className="border p-3 border-gray-300 rounded-lg w-full"
                />
                <button className="p-3 border border-green-500 rounded uppercase text-green-700 hover:shadow-lg disabled:opacity-80">Upload</button>
            </div>
            <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
        </div>
      </form>
    </main>
  );
}
