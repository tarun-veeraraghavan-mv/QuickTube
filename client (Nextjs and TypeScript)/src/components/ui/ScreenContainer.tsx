interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-[800px] mx-auto my-[20px] px-[32px]">{children}</div>
  );
}
