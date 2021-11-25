import { Button, Drawer, Empty, Input } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import algoliasearch from "algoliasearch";
import { InstantSearch, Hits, Pagination, Highlight, connectSearchBox, connectStateResults } from "react-instantsearch-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

//const searchClient = algoliasearch("B1G2GM9NG0", "aadef574be1f9252bb48d4ea09b5cfe5");
const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID as string, process.env.REACT_APP_ALGOLIA_PUBLIC_API_KEY as string);

export default function Search() {
    const [visible, setVisible] = useState(false) 

    function handleOpenSearch() {
      setVisible(true);
    }
    
    function onClose(){
      setVisible(false);      
    }

    return (
        <>
            <Button type="text" onClick={handleOpenSearch} icon={<SearchOutlined />} className="d-none d-sm-block"></Button>

            <InstantSearch indexName={`${process.env.REACT_APP_ALGOLIA_INDEX}`} searchClient={searchClient}>
                <Drawer
                    title={
                        <>
                            <CustomSearchBox/>
                            <Button style={{ marginLeft: "10px" }} type="text" icon={<CloseOutlined size={20}/>} onClick={onClose} />
                        </>
                    }
                    closable={false}
                    placement="right"
                    onClose={onClose}
                    visible={visible}>
                    <div className="right-panel">
                        <Results>
                            <Hits hitComponent={Hit} />
                            <Pagination />
                        </Results>
                    </div>
                </Drawer>
            </InstantSearch>
        </>
    );
}

const SearchBox = ({ currentRefinement, refine }: any) => {
    return (
        <Input
            value={currentRefinement}
            prefix={<SearchOutlined />}
            autoFocus={true}
            placeholder="Tìm kiếm..."
            onChange={e => refine(e.target.value)}
            className="ip-search w-100"
        />
    );
};
const CustomSearchBox = connectSearchBox(SearchBox);

function Hit(props: any) {
    return (
        <div>
            <div className="hit-name">
                <Link to={`/${props.hit.slug}/${props.hit.objectId}`}><Highlight attribute="title" hit={props.hit} /></Link>
            </div>
            <div className="hit-description">
                <Highlight attribute="text" hit={props.hit} />
            </div>
        </div>
    );
}

const Results = connectStateResults(
    ({ searchState, searchResults, children }: any) =>
      searchResults && searchResults.nbHits !== 0 ? (
        children
      ) : (
        <div>
            <Empty description={<div>No results have been found for <b>{searchState.query}</b>.</div>} />
        </div>
      )
  );