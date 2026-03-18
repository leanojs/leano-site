import Image from "next/image";
import Link from "next/link";

const Logo = ({
  src,
  alt,
  width,
  height,
  title,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
}) => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <div>
        <Image src={src} alt="" width={width} height={height} aria-hidden="true" />
      </div>
      <span className="font-semibold text-xl tracking-tight">{title}</span>
    </Link>
  );
};

export default Logo;
