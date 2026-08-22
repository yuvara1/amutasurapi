import DomeGallery from "./ui/dome-gallery";

const foodImages = [
  { src: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=600&h=600&fit=crop&auto=format", alt: "Fresh vegetables pile" },
  { src: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&h=600&fit=crop&auto=format", alt: "Assorted vegetables" },
  { src: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&h=600&fit=crop&auto=format", alt: "Broccoli and peppers" },
  { src: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=600&fit=crop&auto=format", alt: "Variety of vegetables" },
  { src: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=600&h=600&fit=crop&auto=format", alt: "Assorted vegetables market" },
  { src: "https://images.unsplash.com/photo-1557844352-761f2565b576?w=600&h=600&fit=crop&auto=format", alt: "Vegetables and fruits" },
  { src: "https://images.unsplash.com/photo-1599819055803-717bba43890f?w=600&h=600&fit=crop&auto=format", alt: "Fresh bakery bread" },
  { src: "https://images.unsplash.com/photo-1559811814-e2c57b5e69df?w=600&h=600&fit=crop&auto=format", alt: "Sliced fresh bread" },
  { src: "https://images.unsplash.com/photo-1577303935007-0d306ee638cf?w=600&h=600&fit=crop&auto=format", alt: "Community kitchen cooking" },
  { src: "https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=600&h=600&fit=crop&auto=format", alt: "Community meal sharing" },
  { src: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=600&h=600&fit=crop&auto=format", alt: "Prepared meal plates" },
  { src: "https://images.unsplash.com/photo-1777427676365-d84b81691767?w=600&h=600&fit=crop&auto=format", alt: "Volunteers serving food" },
  { src: "https://images.unsplash.com/photo-1761300463257-7a6b70d43c27?w=600&h=600&fit=crop&auto=format", alt: "Group preparing food" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=600&fit=crop&auto=format", alt: "Food distribution" },
  { src: "https://images.unsplash.com/photo-1593113630400-ea4288922559?w=600&h=600&fit=crop&auto=format", alt: "Food rescue delivery" },
];

export default function FoodDomeGallery() {
  return (
    <DomeGallery
      images={foodImages}
      fit={0.8}
      minRadius={600}
      maxVerticalRotationDeg={0}
      segments={34}
      dragDampening={2}
      grayscale={false}
      overlayBlurColor="#030303"
      imageBorderRadius="20px"
      openedImageBorderRadius="20px"
      openedImageWidth="420px"
      openedImageHeight="420px"
    />
  );
}
