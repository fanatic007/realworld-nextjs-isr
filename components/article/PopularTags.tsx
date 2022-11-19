import Link from "next/link";
import {useRouter} from 'next/router';
import { getPath } from "../../pages/home/[path]";
  
const PopularTags = (props:any) => {
  return (
    <div className="col-md-3">      
      <div className="sidebar">
          <p>Popular Tags</p>
          <div className="tag-list">
            {                
              props.tags.map((tag:string)=>
                <Link
                  href={`${getPath({tag, page:1})}`}
                  key={tag + Date.now()}>
                  <a className="tag-pill tag-default">
                    {tag}
                  </a>
                </Link>
              )
            }
          </div>
      </div>
    </div>
  )
};

export default PopularTags