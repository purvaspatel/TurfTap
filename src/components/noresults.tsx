export default function NoResults({ message }: { message?: string }) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <img src="/TurfTapLogo.png" alt="No Results" className="w-48 h-48" />
        <h2 className="text-xl font-semibold mt-4">No Results Found</h2>
        <p className="text-gray-600">Hey! Our community is actively contributing!</p>
        <p className="text-gray-600">{message || "Try adjusting your search or check back later!"}</p>
      </div>
    );
  }
  