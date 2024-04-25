import { useRouter } from 'next/router'
import UpdateWorkflow from '~/components/lib/Workflow/update';
import { WfInstView } from "~/components/workflow/wf-view";

const Page = () => {

  const router = useRouter()
  const { id } = router.query;
  if (!id) {
    return <div> No workflow ID specified. Invald URL?</div>;
  }
  return (
    <UpdateWorkflow wfId ={id as string}/>
    // <WfInstView instanceId={id as string} />
  );
};

export default Page;
