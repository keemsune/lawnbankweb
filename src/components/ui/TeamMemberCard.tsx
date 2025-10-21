interface TeamMemberCardProps {
  name: string
  department: string
  contact: string
  image?: string
}

export function TeamMemberCard({ name, department, contact, image }: TeamMemberCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 border border-border rounded-xl px-3 py-4 sm:px-6 sm:py-7 sm:gap-4">
      <div className="w-[80px] h-[80px] sm:w-[104px] sm:h-[104px] bg-gray-300 rounded-full overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
      </div>
      <div className="text-center">
        <h3 className="text-heading-md-css text-foreground font-medium mb-1">
          {name}
        </h3>
        <p className="text-body-sm-css text-muted-foreground mb-1">
          {department}
        </p>
        <p className="text-body-sm-css text-muted-foreground">
          {contact}
        </p>
      </div>
    </div>
  )
} 