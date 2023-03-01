import Link from "next/link";
  
const PopularTags = ({tags, path, }:any) => {
  return (
    <div className="col-md-3">      
      <div className="sidebar">
          <p>Popular Tags</p>
          <div className="tag-list">
            {                
              tags.map((tag:string)=>
                <Link
                  href={`${path}?${(tag?('tag='+tag)+'&':'')}page=1`}
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