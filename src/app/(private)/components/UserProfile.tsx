import Image from 'next/image'

const imageProfile = '/profile/profile1.svg'

export default function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      <Image
        alt="profile image"
        src={imageProfile}
        width={64}
        height={64}
        className="clip-circle h-8 w-8 bg-white object-cover"
      />
    </div>
  )
}
