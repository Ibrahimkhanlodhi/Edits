import AuthWrapper from "../components/AuthWrapper";
import ImageEditor from "../components/ImageEditor";

export default function EditImagePage() {
  return (
    <AuthWrapper>
      <div>
        <ImageEditor />
      </div>
    </AuthWrapper>
  );
}