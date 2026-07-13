import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#18332C",
          borderRadius: 40,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#F8F2E7"
            d="M8 10h26c16 0 22 8 22 22v26c0 14-6 22-22 22H8V10zm22 16c5-4 12 0 12 7s-6 11-12 9c-6-2-6-10 0-16z"
          />
          <path
            fill="#FFFFFF"
            d="M58 16c22-4 34 10 34 28s-12 36-34 34c-5-1-9-4-11-8l9-9c9 7 20 2 22-8 2-10-5-20-16-22-3-1-6 0-8 2l-6-7z"
          />
          <path
            fill="#F28C28"
            d="M72 58c8 4 6 14-2 16-6 2-12-2-12-8 0-4 6-10 14-8z"
            opacity="0.9"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
